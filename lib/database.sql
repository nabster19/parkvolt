-- 1. PROFILES Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'host')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SLOTS Table (Parking Assets)
CREATE TABLE IF NOT EXISTS public.slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  address TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  has_ev_charging BOOLEAN DEFAULT FALSE,
  charger_type TEXT,
  base_price DECIMAL(10,2) DEFAULT 30.00,
  location_type TEXT DEFAULT 'normal' CHECK (location_type IN ('normal', 'hotspot')),
  is_available BOOLEAN DEFAULT TRUE,
  is_disabled_by_host BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2,1) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BOOKINGS Table (Session State)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  slot_id UUID REFERENCES public.slots(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  total_price DECIMAL(10,2) NOT NULL
);

-- 4. TRANSACTIONS Table (Financial Ledger)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 6. POLICIES

-- Slots: Anyone can view available slots. Only hosts can manage their own.
CREATE POLICY "Public slots are viewable by everyone" ON public.slots FOR SELECT USING (true);
CREATE POLICY "Hosts can insert their own slots" ON public.slots FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update their own slots" ON public.slots FOR UPDATE USING (auth.uid() = host_id);

-- Bookings: Users can see their own bookings. Hosts can see bookings for their slots.
CREATE POLICY "Users can see their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles: Users can manage their own profiles.
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 7. REALTIME ENABLEMENT
ALTER PUBLICATION supabase_realtime ADD TABLE slots, bookings;
