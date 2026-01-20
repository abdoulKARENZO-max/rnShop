// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as aesjs from 'aes-js';
import 'react-native-get-random-values'; // polyfill for crypto.getRandomValues
import { Database } from '../types/supabase.types';
// our real remote suapabase

/* const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY! */

// our local suapabase

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

// Helper: storage key suffix used for storing AES encryption key in SecureStore
const ENC_KEY_SUFFIX = '_encKey_v1';

// LargeSecureStore: a storage adapter that encrypts large values and stores them in AsyncStorage,
// while storing the AES key in Expo SecureStore (which has limits).
class LargeSecureStore {
  // generate 256-bit key as Uint8Array
  private _generateKey() {
    return crypto.getRandomValues(new Uint8Array(256 / 8)); // 32 bytes
  }

  // encrypt plaintext string -> hex string
  private async _encryptValue(keyName: string, value: string) {
    const encryptionKey = this._generateKey();
    // store encryption key hex in SecureStore (under a dedicated key to avoid collisions)
    await SecureStore.setItemAsync(keyName + ENC_KEY_SUFFIX, aesjs.utils.hex.fromBytes(encryptionKey));

    // use AES-CTR with counter 1 (deterministic counter here; for production prefer random IV handling)
    const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  // decrypt hex string -> plaintext string
  private async _decryptValue(keyName: string, encryptedHex: string | null) {
    if (!encryptedHex) return encryptedHex;
    const encryptionKeyHex = await SecureStore.getItemAsync(keyName + ENC_KEY_SUFFIX);
    if (!encryptionKeyHex) {
      // no key present — cannot decrypt
      return null;
    }
    const encryptionKey = aesjs.utils.hex.toBytes(encryptionKeyHex);
    const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(encryptedHex));
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  // Primary API expected by many libs (string keys)
  async getItem(key: string) {
    try {
      const encrypted = await AsyncStorage.getItem(key);
      if (!encrypted) return null;
      return await this._decryptValue(key, encrypted);
    } catch (err) {
      console.warn('LargeSecureStore.getItem error', err);
      return null;
    }
  }

  async setItem(key: string, value: string) {
    try {
      const encrypted = await this._encryptValue(key, value);
      await AsyncStorage.setItem(key, encrypted);
    } catch (err) {
      console.warn('LargeSecureStore.setItem error', err);
      throw err;
    }
  }

  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
      // remove the associated encryption key too
      await SecureStore.deleteItemAsync(key + ENC_KEY_SUFFIX);
    } catch (err) {
      console.warn('LargeSecureStore.removeItem error', err);
      throw err;
    }
  }

  // --- Compatibility layer: expose alternate method names Supabase (or other libs) might call ---
  // Some versions call *Async suffixes:
  async getItemAsync(key: string) {
    return this.getItem(key);
  }
  async setItemAsync(key: string, value: string) {
    return this.setItem(key, value);
  }
  async removeItemAsync(key: string) {
    return this.removeItem(key);
  }

  // Supabase's React Native flow (older/newer variants) may call these names:
  // Provide deleteValueWithKeyAsync as observed in your error stack trace.
  async deleteValueWithKeyAsync(key: string) {
    return this.removeItem(key);
  }

  // also provide deleteItemAsync in case it's expected
  async deleteItemAsync(key: string) {
    return this.removeItem(key);
  }

  // provide synchronous-looking aliases (they return Promises anyway)
  // (some code expects storage.methodName to exist; this avoids undefined calls)
  getItemSync = (key: string) => this.getItem(key);
  setItemSync = (key: string, value: string) => this.setItem(key, value);
  removeItemSync = (key: string) => this.removeItem(key);
}

const storage = new LargeSecureStore();

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage, // pass our adapter
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
