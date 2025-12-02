--
-- PostgreSQL database dump
--

\restrict nPldR1UDZeSx8K7s3mv1DJ57ELjoN766sVRvpL0m76RSdWEkqdviYece0uAGMf9

-- Dumped from database version 17.6 (Debian 17.6-2.pgdg13+1)
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;

SET lock_timeout = 0;

SET idle_in_transaction_session_timeout = 0;

SET transaction_timeout = 0;

SET client_encoding = 'UTF8';

SET standard_conforming_strings = on;

SELECT pg_catalog.set_config ('search_path', '', false);

SET check_function_bodies = false;

SET xmloption = content;

SET client_min_messages = warning;

SET row_security = off;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: rubin_user
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN

    NEW.updated_at = NOW();

    RETURN NEW;

END;

$$;

ALTER FUNCTION public.update_updated_at_column() OWNER TO rubin_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: rubin_user
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    user_id integer NOT NULL,
    diamond_stock_id character varying(255) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    added_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.cart_items OWNER TO rubin_user;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: rubin_user
--

CREATE SEQUENCE public.cart_items_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.cart_items_id_seq OWNER TO rubin_user;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rubin_user
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;

--
-- Name: diamants; Type: TABLE; Schema: public; Owner: rubin_user
--

CREATE TABLE public.diamants (
    stock_id character varying(255) NOT NULL,
    availability character varying(50),
    shape character varying(50),
    weight numeric(10, 5),
    color character varying(50),
    clarity character varying(50),
    cut_grade character varying(50),
    polish character varying(50),
    symmetry character varying(50),
    fluorescence_intensity character varying(50),
    fluorescence_color character varying(50),
    measurements text,
    lab character varying(50),
    certificate_number character varying(100),
    treatment character varying(100),
    price_carat numeric(18, 5),
    fancy_color character varying(50),
    fancy_color_intensity character varying(50),
    fancy_color_overtone character varying(50),
    depth_pct numeric(5, 2),
    table_pct numeric(5, 2),
    girdle_thin character varying(50),
    girdle_thick character varying(50),
    girdle_pct numeric(5, 2),
    girdle_condition character varying(50),
    culet_size character varying(50),
    culet_condition character varying(50),
    crown_height numeric(5, 2),
    crown_angle numeric(5, 2),
    pavilion_depth numeric(5, 2),
    pavilion_angle numeric(5, 2),
    laser_inscription boolean,
    comment text,
    country character varying(50),
    state character varying(50),
    city character varying(50),
    is_matched_pair_separable boolean,
    pair_stock_id character varying(255),
    allow_raplink_feed boolean,
    parcel_stones boolean,
    certificate_filename text,
    diamond_image text,
    "3d_file" text,
    trade_show character varying(100),
    member_comments text,
    rap numeric(18, 5),
    disc numeric(8, 5),
    video_file text,
    image_file text,
    certificate_file text,
    is_special boolean DEFAULT false NOT NULL,
    is_upcoming boolean DEFAULT false NOT NULL
);

ALTER TABLE public.diamants OWNER TO rubin_user;

--
-- Name: quote_items; Type: TABLE; Schema: public; Owner: rubin_user
--

CREATE TABLE public.quote_items (
    id integer NOT NULL,
    quote_id integer NOT NULL,
    diamond_stock_id character varying(255) NOT NULL
);

ALTER TABLE public.quote_items OWNER TO rubin_user;

--
-- Name: quote_items_id_seq; Type: SEQUENCE; Schema: public; Owner: rubin_user
--

CREATE SEQUENCE public.quote_items_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.quote_items_id_seq OWNER TO rubin_user;

--
-- Name: quote_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rubin_user
--

ALTER SEQUENCE public.quote_items_id_seq OWNED BY public.quote_items.id;

--
-- Name: quotes; Type: TABLE; Schema: public; Owner: rubin_user
--

CREATE TABLE public.quotes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.quotes OWNER TO rubin_user;

--
-- Name: quotes_id_seq; Type: SEQUENCE; Schema: public; Owner: rubin_user
--

CREATE SEQUENCE public.quotes_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.quotes_id_seq OWNER TO rubin_user;

--
-- Name: quotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rubin_user
--

ALTER SEQUENCE public.quotes_id_seq OWNED BY public.quotes.id;

--
-- Name: search_filters; Type: TABLE; Schema: public; Owner: rubin_user
--

CREATE TABLE public.search_filters (
    filter_name character varying(255) NOT NULL,
    is_enabled boolean DEFAULT true
);

ALTER TABLE public.search_filters OWNER TO rubin_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: rubin_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    prefix character varying(50),
    first_name character varying(100),
    last_name character varying(100),
    phone_number character varying(50),
    designation character varying(100),
    seller character varying(100),
    company_name character varying(255),
    company_owner character varying(255),
    company_type character varying(100),
    company_email character varying(255),
    company_address text,
    company_city character varying(100),
    company_country character varying(100),
    company_zip_code character varying(20),
    id_document_url text,
    business_registration_url text,
    how_found_us text,
    accept_terms boolean DEFAULT false NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    reset_password_token character varying(255),
    reset_password_expires timestamp with time zone
);

ALTER TABLE public.users OWNER TO rubin_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: rubin_user
--

CREATE SEQUENCE public.users_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNER TO rubin_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rubin_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

--
-- Name: watchlist_items; Type: TABLE; Schema: public; Owner: rubin_user
--

CREATE TABLE public.watchlist_items (
    id integer NOT NULL,
    user_id integer NOT NULL,
    diamond_stock_id character varying(255) NOT NULL,
    added_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.watchlist_items OWNER TO rubin_user;

--
-- Name: watchlist_items_id_seq; Type: SEQUENCE; Schema: public; Owner: rubin_user
--

CREATE SEQUENCE public.watchlist_items_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.watchlist_items_id_seq OWNER TO rubin_user;

--
-- Name: watchlist_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rubin_user
--

ALTER SEQUENCE public.watchlist_items_id_seq OWNED BY public.watchlist_items.id;

--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.cart_items
ALTER COLUMN id
SET DEFAULT nextval(
    'public.cart_items_id_seq'::regclass
);

--
-- Name: quote_items id; Type: DEFAULT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.quote_items
ALTER COLUMN id
SET DEFAULT nextval(
    'public.quote_items_id_seq'::regclass
);

--
-- Name: quotes id; Type: DEFAULT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.quotes
ALTER COLUMN id
SET DEFAULT nextval(
    'public.quotes_id_seq'::regclass
);

--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.users
ALTER COLUMN id
SET DEFAULT nextval(
    'public.users_id_seq'::regclass
);

--
-- Name: watchlist_items id; Type: DEFAULT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.watchlist_items
ALTER COLUMN id
SET DEFAULT nextval(
    'public.watchlist_items_id_seq'::regclass
);

--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.cart_items
ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);

--
-- Name: cart_items cart_items_user_id_diamond_stock_id_key; Type: CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.cart_items
ADD CONSTRAINT cart_items_user_id_diamond_stock_id_key UNIQUE (user_id, diamond_stock_id);

--
-- Name: diamants diamants_pkey; Type: CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.diamants
ADD CONSTRAINT diamants_pkey PRIMARY KEY (stock_id);

--
-- Name: quote_items quote_items_pkey; Type: CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.quote_items
ADD CONSTRAINT quote_items_pkey PRIMARY KEY (id);

--
-- Name: quote_items quote_items_quote_id_diamond_stock_id_key; Type: CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.quote_items
ADD CONSTRAINT quote_items_quote_id_diamond_stock_id_key UNIQUE (quote_id, diamond_stock_id);

--
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.quotes
ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);

--
-- Name: search_filters search_filters_pkey; Type: CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.search_filters
ADD CONSTRAINT search_filters_pkey PRIMARY KEY (filter_name);

--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.users
ADD CONSTRAINT users_email_key UNIQUE (email);

--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.users
ADD CONSTRAINT users_pkey PRIMARY KEY (id);

--
-- Name: watchlist_items watchlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.watchlist_items
ADD CONSTRAINT watchlist_items_pkey PRIMARY KEY (id);

--
-- Name: watchlist_items watchlist_items_user_id_diamond_stock_id_key; Type: CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.watchlist_items
ADD CONSTRAINT watchlist_items_user_id_diamond_stock_id_key UNIQUE (user_id, diamond_stock_id);

--
-- Name: idx_cart_items_user_id; Type: INDEX; Schema: public; Owner: rubin_user
--

CREATE INDEX idx_cart_items_user_id ON public.cart_items USING btree (user_id);

--
-- Name: idx_diamants_is_special; Type: INDEX; Schema: public; Owner: rubin_user
--

CREATE INDEX idx_diamants_is_special ON public.diamants USING btree (is_special);

--
-- Name: idx_diamants_is_upcoming; Type: INDEX; Schema: public; Owner: rubin_user
--

CREATE INDEX idx_diamants_is_upcoming ON public.diamants USING btree (is_upcoming);

--
-- Name: idx_quote_items_quote_id; Type: INDEX; Schema: public; Owner: rubin_user
--

CREATE INDEX idx_quote_items_quote_id ON public.quote_items USING btree (quote_id);

--
-- Name: idx_quotes_user_id; Type: INDEX; Schema: public; Owner: rubin_user
--

CREATE INDEX idx_quotes_user_id ON public.quotes USING btree (user_id);

--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: rubin_user
--

CREATE INDEX idx_users_email ON public.users USING btree (email);

--
-- Name: idx_watchlist_items_user_id; Type: INDEX; Schema: public; Owner: rubin_user
--

CREATE INDEX idx_watchlist_items_user_id ON public.watchlist_items USING btree (user_id);

--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: rubin_user
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

--
-- Name: cart_items fk_diamond; Type: FK CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.cart_items
ADD CONSTRAINT fk_diamond FOREIGN KEY (diamond_stock_id) REFERENCES public.diamants (stock_id) ON DELETE CASCADE;

--
-- Name: watchlist_items fk_diamond; Type: FK CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.watchlist_items
ADD CONSTRAINT fk_diamond FOREIGN KEY (diamond_stock_id) REFERENCES public.diamants (stock_id) ON DELETE CASCADE;

--
-- Name: quote_items fk_diamond; Type: FK CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.quote_items
ADD CONSTRAINT fk_diamond FOREIGN KEY (diamond_stock_id) REFERENCES public.diamants (stock_id) ON DELETE CASCADE;

--
-- Name: quote_items fk_quote; Type: FK CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.quote_items
ADD CONSTRAINT fk_quote FOREIGN KEY (quote_id) REFERENCES public.quotes (id) ON DELETE CASCADE;

--
-- Name: cart_items fk_user; Type: FK CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.cart_items
ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;

--
-- Name: watchlist_items fk_user; Type: FK CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.watchlist_items
ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;

--
-- Name: quotes fk_user; Type: FK CONSTRAINT; Schema: public; Owner: rubin_user
--

ALTER TABLE ONLY public.quotes
ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO rubin_user;

--
-- Name: logs; Type: TABLE; Schema: public; Owner: rubin_user
--
CREATE TABLE public.logs (
    id integer NOT NULL,
    user_id integer,
    level character varying(20) NOT NULL,
    action character varying(255) NOT NULL,
    details jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.logs OWNER TO rubin_user;
CREATE SEQUENCE public.logs_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.logs_id_seq OWNER TO rubin_user;
ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;
ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);
ALTER TABLE ONLY public.logs ADD CONSTRAINT logs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.logs ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;
CREATE INDEX idx_logs_user_id ON public.logs USING btree (user_id);

--
-- Name: email_templates; Type: TABLE; Schema: public; Owner: rubin_user
--
CREATE TABLE public.email_templates (
    id integer NOT NULL,
    template_name character varying(255) UNIQUE NOT NULL,
    subject character varying(255) NOT NULL,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.email_templates OWNER TO rubin_user;
CREATE SEQUENCE public.email_templates_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.email_templates_id_seq OWNER TO rubin_user;
ALTER SEQUENCE public.email_templates_id_seq OWNED BY public.email_templates.id;
ALTER TABLE ONLY public.email_templates ALTER COLUMN id SET DEFAULT nextval('public.email_templates_id_seq'::regclass);
ALTER TABLE ONLY public.email_templates ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- PostgreSQL database dump complete
--

\unrestrict nPldR1UDZeSx8K7s3mv1DJ57ELjoN766sVRvpL0m76RSdWEkqdviYece0uAGMf9


