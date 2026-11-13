export type F={g:string;k:string;l:string;t?:string;r?:boolean;o?:string[]}
const YN=["Yes","No"], YNM=["Yes","No","Not sure"]
export const FEATURES=["User Registration and Login","Product Search","Product Categories","Product Filters","Shopping Cart","Wishlist","Checkout","Online Payment Gateway","UPI Payments","Cash on Delivery","Order Tracking","Coupon Management","Inventory Management","Admin Dashboard","WhatsApp Integration","Customer Reviews and Ratings","Email Notifications","Invoice Generation"]
export const STEPS:{title:string;hint:string;fields:F[]}[]=[
{title:"Organization",hint:"Tell us who you are and how to reach you.",fields:[
{g:"organizations",k:"name",l:"Organization name",r:true},{g:"organizations",k:"founder_name",l:"Founder name",r:true},
{g:"contacts",k:"contact_person",l:"Contact person name"},{g:"contacts",k:"mobile",l:"Mobile number",t:"tel",r:true},
{g:"contacts",k:"whatsapp",l:"WhatsApp number",t:"tel"},{g:"contacts",k:"email",l:"Official email address",t:"email",r:true},
{g:"organizations",k:"address",l:"Business address",t:"textarea"},{g:"organizations",k:"website_url",l:"Existing website URL",t:"url"},
{g:"organizations",k:"instagram",l:"Instagram profile",t:"url"},{g:"organizations",k:"facebook",l:"Facebook profile",t:"url"},
{g:"organizations",k:"logo",l:"Company logo",t:"logo"}]},
{title:"Business",hint:"Help us understand your brand and customers.",fields:[
{g:"organizations",k:"category",l:"Business category"},{g:"organizations",k:"established_year",l:"Year of establishment",t:"number"},
{g:"organizations",k:"target_audience",l:"Target audience"},{g:"organizations",k:"business_location",l:"Business location"},
{g:"organizations",k:"about",l:"About the organization",t:"textarea"},{g:"organizations",k:"brand_description",l:"Brand description",t:"textarea"}]},
{title:"Products",hint:"Add every product you want to sell. You can add as many as you need.",fields:[]},
{title:"Features",hint:"Select everything your store should do.",fields:[{g:"website",k:"features",l:"Store features",t:"multi",o:FEATURES}]},
{title:"Payment & delivery",hint:"How customers pay and how orders reach them.",fields:[
{g:"payment",k:"methods",l:"Preferred payment methods",t:"multi",o:["UPI","Credit / Debit Card","Net Banking","Cash on Delivery","Wallets"]},
{g:"payment",k:"gateway",l:"Payment gateway preference",t:"select",o:["Razorpay","PhonePe","Cashfree","Stripe","PayU","No preference"]},
{g:"delivery",k:"locations",l:"Delivery locations"},{g:"delivery",k:"shipping_charges",l:"Shipping charges"},
{g:"delivery",k:"free_shipping_conditions",l:"Free shipping conditions"},{g:"delivery",k:"partner",l:"Delivery partner preference"},
{g:"delivery",k:"return_policy",l:"Return and refund policy",t:"textarea"},{g:"delivery",k:"delivery_time",l:"Estimated delivery time"}]},
{title:"Design",hint:"Show us the look you have in mind.",fields:[
{g:"design",k:"colour_theme",l:"Preferred colour theme"},{g:"design",k:"language",l:"Website language",t:"select",o:["English","Tamil","Both"]},
{g:"design",k:"style",l:"Preferred website style",t:"select",o:["Modern minimal","Traditional","Bold and colourful","Premium / luxury"]},
{g:"design",k:"logo_available",l:"Is your logo available?",t:"select",o:YN},{g:"design",k:"banners_available",l:"Are banner images available?",t:"select",o:YN},
{g:"design",k:"mobile_responsive",l:"Mobile responsive required?",t:"select",o:YN},{g:"design",k:"reference_links",l:"Website reference links",t:"textarea"}]},
{title:"Technical",hint:"Domain, hosting and add-ons.",fields:[
{g:"technical",k:"owns_domain",l:"Do you already own a domain?",t:"select",o:YN},{g:"technical",k:"domain_name",l:"Domain name"},
{g:"technical",k:"has_hosting",l:"Do you have hosting?",t:"select",o:YN},{g:"technical",k:"hosting_provider",l:"Hosting provider"},
{g:"technical",k:"business_email",l:"Need business email?",t:"select",o:YN},{g:"technical",k:"seo",l:"Need SEO optimization?",t:"select",o:YN},
{g:"technical",k:"analytics",l:"Need Google Analytics?",t:"select",o:YN},{g:"technical",k:"pixel",l:"Need Facebook Pixel?",t:"select",o:YN},
{g:"technical",k:"admin_training",l:"Need admin training?",t:"select",o:YN}]},
{title:"Additional",hint:"Last details before you review.",fields:[
{g:"submission",k:"launch_date",l:"Expected launch date",t:"date"},{g:"submission",k:"budget",l:"Estimated budget"},
{g:"website",k:"additional_features",l:"Additional features",t:"textarea"},{g:"submission",k:"special_instructions",l:"Special instructions",t:"textarea"},
{g:"contacts",k:"approval_contact",l:"Contact person for project approval"}]}]
export const TABLE:Record<string,string>={organizations:"organizations",contacts:"contacts",website:"website_requirements",payment:"payment_requirements",delivery:"delivery_requirements",design:"design_preferences",technical:"technical_requirements",submission:"submissions"}
export const PRODUCT_FIELDS:F[]=[
{g:"p",k:"name",l:"Product name",r:true},{g:"p",k:"category",l:"Product category"},
{g:"p",k:"original_price",l:"Original price (₹)",t:"number"},{g:"p",k:"selling_price",l:"Selling price (₹)",t:"number",r:true},
{g:"p",k:"weight_size",l:"Weight / size"},{g:"p",k:"variants",l:"Available variants"},
{g:"p",k:"stock",l:"Stock availability",t:"select",o:["In stock","Limited stock","Made to order","Out of stock"]},{g:"p",k:"sku",l:"SKU (optional)"},
{g:"p",k:"description",l:"Product description",t:"textarea"}]
