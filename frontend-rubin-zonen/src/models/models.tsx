export interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    body: string;
    created_at: string;
    updated_at: string;
};

export interface CartItem {
    cart_id: number;
    user_id: number;
    diamond_stock_id: string;
    quantity: number;
    added_at: string;
};

export interface Diamant {
    stock_id: string;
    availability: string;
    shape: string;
    weight: number;
    color: string;
    clarity: string;
    cut_grade: string;
    polish: string;
    symmetry: string;
    fluorescence_intensity: string;
    fluorescence_color: string;
    measurements: string;
    lab: string;
    certificate_number: string;
    treatment: string;
    price_carat: number;
    fancy_color: string;
    fancy_color_intensity: string;
    fancy_color_overtone: string;
    depth_pct: number;
    table_pct: number;
    girdle_thin: string;
    girdle_thick: string;
    girdle_pct: number;
    girdle_condition: string;
    culet_size: string;
    culet_condition: string;
    crown_height: number;
    crown_angle: number;
    pavilion_depth: number;
    pavilion_angle: number;
    laser_inscription: boolean;
    comment?: string;
    country: string;
    state: string;
    city: string;
    is_matched_pair_separable: boolean;
    pair_stock_id: string;
    allow_raplink_feed: boolean;
    parcel_stones: boolean;
    certificate_filename: string;
    diamond_image: string;
    "3d_file": string;
    trade_show: string;
    member_comments: string;
    rap: number;
    disc: number;
    video_file: string;
    image_file: string;
    certificate_file: string;
    is_special: boolean;
    is_upcoming: boolean;
};

export interface QuoteItem {
    id: number;
    quote_id: number;
    diamond_stock_id: string;
};

export interface Quote {
    id: number;
    user_id: number;
    status: string;
    created_at: string;
    updated_at: string;
};

export interface User {
    id: number;
    email: string;
    password?: string; // Password should likely be optional on the frontend
    prefix: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    designation: string;
    seller: string;
    company_name: string;
    company_owner: string;
    company_type: string;
    company_email: string;
    company_address: string;
    company_city: string;
    company_country: string;
    company_zip_code: string;
    id_document_url: string;
    business_registration_url: string;
    how_found_us: string;
    accept_terms: boolean;
    is_admin: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export interface WatchlistItem {
    id: number;
    user_id: number;
    diamond_stock_id: string;
    added_at: string;
};

export interface Filter {
    filter_name: string;
    is_enabled: boolean;
};
