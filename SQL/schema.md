## Table `bills`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `igst_enabled` | `bool` |  Nullable |
| `invoice_no` | `text` |  |
| `customer_name` | `text` |  |
| `amount` | `numeric` |  |
| `gst_amount` | `numeric` |  |
| `total_with_gst` | `numeric` |  |
| `date` | `text` |  |
| `payment_mode` | `text` |  |
| `notes` | `text` |  Nullable |
| `user_email` | `text` |  |
| `id` | `uuid` | Primary |
| `gst_percentage` | `numeric` |  |
| `created_at` | `timestamptz` |  Nullable |
| `status` | `text` |  Nullable |
| `mode_of_transport` | `text` |  Nullable |
| `rr_gr_no` | `text` |  Nullable |

## Table `quotations`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `quotation_no` | `text` |  |
| `client_name` | `text` |  |
| `amount` | `numeric` |  |
| `valid_till` | `text` |  |
| `terms_and_conditions` | `text` |  Nullable |
| `user_email` | `text` |  |
| `id` | `uuid` | Primary |
| `status` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |

## Table `companies`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `name` | `text` |  Unique |
| `id` | `uuid` | Primary |
| `created_at` | `timestamptz` |  |

## Table `categories`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `name` | `text` |  |
| `company_id` | `uuid` |  |
| `id` | `uuid` | Primary |
| `created_at` | `timestamptz` |  |

## Table `inventory_items`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `name` | `text` |  Nullable |
| `category` | `text` |  Nullable |
| `selling_price` | `numeric` |  Nullable |
| `cost_price` | `numeric` |  Nullable |
| `quantity` | `int4` |  Nullable |
| `image_url` | `text` |  Nullable |
| `company_name` | `text` |  Nullable |
| `product_name` | `text` |  |
| `description` | `text` |  Nullable |
| `sku` | `text` |  Nullable |
| `hsn` | `text` |  Nullable |
| `watt` | `text` |  Nullable |
| `company_id` | `uuid` |  |
| `category_id` | `uuid` |  |
| `id` | `uuid` | Primary |
| `dealer_price` | `numeric` |  Nullable |
| `mrp` | `numeric` |  Nullable |
| `created_at` | `timestamptz` |  |

## Table `clients`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `customer_name` | `text` |  |
| `customer_address` | `text` |  Nullable |
| `customer_phone` | `text` |  Nullable |
| `customer_gst` | `text` |  Nullable |
| `user_email` | `text` |  |
| `id` | `uuid` | Primary |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |

