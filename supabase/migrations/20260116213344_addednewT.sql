alter table "public"."users" add column "stripe_customer_id" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.decrement_product_quantity(product_id bigint, quantity bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE product
  SET "maxQuantity"="maxQuantity"-quantity
  WHERE id=product_id AND "maxQuantity">=quantity;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Set default avatar if not provided
  IF new.raw_user_meta_data->>'avatar_url' IS NULL OR new.raw_user_meta_data->>'avatar_url' = '' THEN
    new.raw_user_meta_data = jsonb_set(
      new.raw_user_meta_data,
      '{avatar_url}', 
      '"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"'
    );
  END IF;
  
  -- Insert into public.users with proper error handling
  BEGIN
    INSERT INTO public.users (id, email, avatar_url)
    VALUES (
      new.id,
      new.email,
      new.raw_user_meta_data->>'avatar_url'
    );
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to insert user % into public.users: %', new.email, SQLERRM;
      -- Still return new to not block auth user creation
  END;
  
  RETURN new;
END;
$function$
;


