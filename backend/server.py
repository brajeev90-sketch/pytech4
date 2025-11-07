from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    slug: str
    description: str
    short_description: str
    features: List[str]
    process_steps: List[dict]
    keywords: List[str]

class City(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    slug: str
    state: str
    tier: str
    areas: List[str]

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    client_name: str
    company: str
    rating: int
    content: str
    city: Optional[str] = None

class Portfolio(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    category: str
    description: str
    image_url: str
    city: Optional[str] = None

class ContactForm(BaseModel):
    name: str
    email: str
    phone: str
    city: str
    service: str
    message: str

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    city: str
    service: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ServiceCityPage(BaseModel):
    service: Service
    city: City
    meta_title: str
    meta_description: str
    keywords: List[str]

# Routes
@api_router.get("/")
async def root():
    return {"message": "PyTech Digital API"}

@api_router.get("/services", response_model=List[Service])
async def get_services():
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    return services

@api_router.get("/services/{service_slug}", response_model=Service)
async def get_service(service_slug: str):
    service = await db.services.find_one({"slug": service_slug}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@api_router.get("/cities", response_model=List[City])
async def get_cities():
    cities = await db.cities.find({}, {"_id": 0}).to_list(1000)
    return cities

@api_router.get("/cities/{city_slug}", response_model=City)
async def get_city(city_slug: str):
    city = await db.cities.find_one({"slug": city_slug}, {"_id": 0})
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city

@api_router.get("/service-city/{service_slug}/{city_slug}", response_model=ServiceCityPage)
async def get_service_city_page(service_slug: str, city_slug: str):
    service = await db.services.find_one({"slug": service_slug}, {"_id": 0})
    city = await db.cities.find_one({"slug": city_slug}, {"_id": 0})
    
    if not service or not city:
        raise HTTPException(status_code=404, detail="Service or City not found")
    
    meta_title = f"{service['name']} Company in {city['name']} | PyTech Digital"
    meta_description = f"Professional {service['name']} services in {city['name']}. PyTech Digital offers expert {service['name'].lower()} solutions. Contact us: +91 9205 222 170"
    keywords = [
        f"{service['name'].lower()} company in {city['name'].lower()}",
        f"{service['name'].lower()} services in {city['name'].lower()}",
        f"best {service['name'].lower()} agency in {city['name'].lower()}",
        f"{service['name'].lower()} near me",
        f"professional {service['name'].lower()} {city['name'].lower()}"
    ]
    
    return ServiceCityPage(
        service=Service(**service),
        city=City(**city),
        meta_title=meta_title,
        meta_description=meta_description,
        keywords=keywords
    )

@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(100)
    return testimonials

@api_router.get("/portfolio", response_model=List[Portfolio])
async def get_portfolio():
    portfolio = await db.portfolio.find({}, {"_id": 0}).to_list(100)
    return portfolio

@api_router.post("/contact", response_model=ContactSubmission)
async def submit_contact(form: ContactForm):
    submission = ContactSubmission(**form.model_dump())
    doc = submission.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.contact_submissions.insert_one(doc)
    
    # Here you would typically send an email notification
    logger.info(f"New contact submission from {form.name} - {form.email}")
    
    return submission

@api_router.get("/sitemap-data")
async def get_sitemap_data():
    """Returns all service-city combinations for sitemap generation"""
    services = await db.services.find({}, {"_id": 0, "slug": 1, "name": 1}).to_list(100)
    cities = await db.cities.find({}, {"_id": 0, "slug": 1, "name": 1}).to_list(1000)
    
    urls = []
    for service in services:
        for city in cities:
            urls.append({
                "url": f"/{service['slug']}/{city['slug']}",
                "service": service['name'],
                "city": city['name']
            })
    
    return {
        "total_pages": len(urls),
        "urls": urls
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db():
    """Initialize database with seed data if empty"""
    try:
        # Check if data exists
        service_count = await db.services.count_documents({})
        city_count = await db.cities.count_documents({})
        
        if service_count == 0:
            logger.info("Seeding services...")
            await seed_services()
        
        if city_count == 0:
            logger.info("Seeding cities...")
            await seed_cities()
            
        testimonial_count = await db.testimonials.count_documents({})
        if testimonial_count == 0:
            logger.info("Seeding testimonials...")
            await seed_testimonials()
            
        portfolio_count = await db.portfolio.count_documents({})
        if portfolio_count == 0:
            logger.info("Seeding portfolio...")
            await seed_portfolio()
            
    except Exception as e:
        logger.error(f"Error during startup seeding: {e}")

async def seed_services():
    services = [
        {
            "id": "1",
            "name": "Branding Services",
            "slug": "branding-services",
            "description": "Transform your business identity with our comprehensive branding services. We create memorable brand experiences that resonate with your target audience and set you apart from competitors.",
            "short_description": "Build a powerful brand identity that stands out",
            "features": [
                "Logo Design & Brand Identity",
                "Brand Strategy & Positioning",
                "Visual Identity Systems",
                "Brand Guidelines & Standards",
                "Marketing Collateral Design",
                "Brand Messaging & Voice"
            ],
            "process_steps": [
                {"step": 1, "title": "Discovery", "description": "Understand your business, goals, and target audience"},
                {"step": 2, "title": "Strategy", "description": "Develop brand positioning and messaging framework"},
                {"step": 3, "title": "Design", "description": "Create visual identity and brand assets"},
                {"step": 4, "title": "Implementation", "description": "Apply branding across all touchpoints"},
                {"step": 5, "title": "Guidelines", "description": "Deliver comprehensive brand guidelines"}
            ],
            "keywords": ["branding", "brand identity", "logo design", "visual identity"]
        },
        {
            "id": "2",
            "name": "Website Design",
            "slug": "website-design",
            "description": "Create stunning, high-performing websites that drive results. Our expert team designs responsive, user-friendly websites optimized for conversions and search engines.",
            "short_description": "Professional websites that convert visitors into customers",
            "features": [
                "Custom Website Design",
                "Responsive Mobile Design",
                "E-commerce Development",
                "CMS Integration",
                "SEO-Optimized Structure",
                "Fast Loading Performance"
            ],
            "process_steps": [
                {"step": 1, "title": "Consultation", "description": "Discuss your requirements and objectives"},
                {"step": 2, "title": "Design", "description": "Create mockups and design concepts"},
                {"step": 3, "title": "Development", "description": "Build responsive, functional website"},
                {"step": 4, "title": "Testing", "description": "Quality assurance and cross-browser testing"},
                {"step": 5, "title": "Launch", "description": "Deploy and provide ongoing support"}
            ],
            "keywords": ["website design", "web development", "responsive design", "ecommerce"]
        },
        {
            "id": "3",
            "name": "App Development",
            "slug": "app-development",
            "description": "Build powerful mobile applications that engage users and grow your business. We develop native and cross-platform apps with exceptional user experience.",
            "short_description": "Native and cross-platform mobile apps that users love",
            "features": [
                "iOS App Development",
                "Android App Development",
                "Cross-Platform Solutions",
                "UI/UX Design",
                "App Store Optimization",
                "Maintenance & Support"
            ],
            "process_steps": [
                {"step": 1, "title": "Planning", "description": "Define features and technical requirements"},
                {"step": 2, "title": "Design", "description": "Create intuitive UI/UX designs"},
                {"step": 3, "title": "Development", "description": "Build app with latest technologies"},
                {"step": 4, "title": "Testing", "description": "Rigorous testing across devices"},
                {"step": 5, "title": "Deployment", "description": "Launch on app stores with ongoing support"}
            ],
            "keywords": ["app development", "mobile app", "ios development", "android development"]
        },
        {
            "id": "4",
            "name": "Digital Marketing Services",
            "slug": "digital-marketing-services",
            "description": "Accelerate your online growth with data-driven digital marketing strategies. We help businesses reach their target audience and maximize ROI through comprehensive digital campaigns.",
            "short_description": "Data-driven marketing strategies that deliver results",
            "features": [
                "Search Engine Optimization (SEO)",
                "Pay-Per-Click Advertising (PPC)",
                "Social Media Marketing",
                "Content Marketing",
                "Email Marketing Campaigns",
                "Analytics & Reporting"
            ],
            "process_steps": [
                {"step": 1, "title": "Audit", "description": "Analyze current digital presence"},
                {"step": 2, "title": "Strategy", "description": "Develop customized marketing plan"},
                {"step": 3, "title": "Execution", "description": "Implement campaigns across channels"},
                {"step": 4, "title": "Optimization", "description": "Continuously improve performance"},
                {"step": 5, "title": "Reporting", "description": "Provide detailed analytics and insights"}
            ],
            "keywords": ["digital marketing", "seo", "ppc", "social media marketing"]
        },
        {
            "id": "5",
            "name": "Enquiry Generation Services",
            "slug": "enquiry-generation-services",
            "description": "Generate high-quality leads that convert into customers. Our targeted enquiry generation strategies help businesses fill their sales pipeline with qualified prospects.",
            "short_description": "Qualified leads that turn into paying customers",
            "features": [
                "Lead Generation Campaigns",
                "Landing Page Optimization",
                "Conversion Rate Optimization",
                "Lead Nurturing Systems",
                "Multi-Channel Outreach",
                "CRM Integration"
            ],
            "process_steps": [
                {"step": 1, "title": "Target", "description": "Identify ideal customer profile"},
                {"step": 2, "title": "Attract", "description": "Create compelling lead magnets"},
                {"step": 3, "title": "Capture", "description": "Optimize conversion touchpoints"},
                {"step": 4, "title": "Nurture", "description": "Engage leads with relevant content"},
                {"step": 5, "title": "Convert", "description": "Close deals with qualified prospects"}
            ],
            "keywords": ["lead generation", "enquiry generation", "conversion optimization", "sales funnel"]
        },
        {
            "id": "6",
            "name": "Search Engine Optimization",
            "slug": "search-engine-optimization",
            "description": "Dominate search results and drive organic traffic with our expert SEO services. We optimize your website to rank higher on Google and other search engines, bringing qualified traffic to your business.",
            "short_description": "Rank higher on Google and drive organic traffic",
            "features": [
                "Technical SEO Audit",
                "On-Page Optimization",
                "Off-Page SEO & Link Building",
                "Local SEO",
                "Keyword Research & Strategy",
                "SEO Performance Reporting"
            ],
            "process_steps": [
                {"step": 1, "title": "Audit", "description": "Comprehensive SEO audit of your website"},
                {"step": 2, "title": "Research", "description": "Keyword research and competitor analysis"},
                {"step": 3, "title": "Optimize", "description": "Implement on-page and technical SEO"},
                {"step": 4, "title": "Build", "description": "Quality link building and content strategy"},
                {"step": 5, "title": "Monitor", "description": "Track rankings and optimize continuously"}
            ],
            "keywords": ["seo", "search engine optimization", "google ranking", "organic traffic"]
        },
        {
            "id": "7",
            "name": "App Marketing",
            "slug": "app-marketing",
            "description": "Boost your app downloads and user engagement with comprehensive app marketing strategies. From app store optimization to user acquisition campaigns, we help your app succeed.",
            "short_description": "Drive app downloads and user engagement",
            "features": [
                "App Store Optimization (ASO)",
                "User Acquisition Campaigns",
                "In-App Marketing",
                "App Analytics & Insights",
                "Retention Strategies",
                "Influencer Marketing"
            ],
            "process_steps": [
                {"step": 1, "title": "Analysis", "description": "Analyze app market and competitors"},
                {"step": 2, "title": "Optimize", "description": "ASO for app stores"},
                {"step": 3, "title": "Launch", "description": "User acquisition campaigns"},
                {"step": 4, "title": "Engage", "description": "In-app engagement strategies"},
                {"step": 5, "title": "Retain", "description": "User retention and re-engagement"}
            ],
            "keywords": ["app marketing", "aso", "user acquisition", "app downloads"]
        },
        {
            "id": "8",
            "name": "Content Marketing",
            "slug": "content-marketing",
            "description": "Engage your audience with compelling content that drives results. Our content marketing services help you build authority, generate leads, and grow your business through strategic content.",
            "short_description": "Strategic content that engages and converts",
            "features": [
                "Content Strategy Development",
                "Blog Writing & Management",
                "Video Content Creation",
                "Infographics & Visual Content",
                "Social Media Content",
                "Content Distribution"
            ],
            "process_steps": [
                {"step": 1, "title": "Strategy", "description": "Develop content marketing strategy"},
                {"step": 2, "title": "Create", "description": "Produce high-quality content"},
                {"step": 3, "title": "Optimize", "description": "SEO optimization for content"},
                {"step": 4, "title": "Distribute", "description": "Multi-channel content distribution"},
                {"step": 5, "title": "Measure", "description": "Track performance and refine"}
            ],
            "keywords": ["content marketing", "blog writing", "content strategy", "video content"]
        },
        {
            "id": "9",
            "name": "PPC/Paid Marketing",
            "slug": "ppc-paid-marketing",
            "description": "Maximize ROI with targeted paid advertising campaigns. Our PPC experts manage Google Ads, Facebook Ads, and other paid channels to drive qualified traffic and conversions.",
            "short_description": "Targeted paid ads that deliver high ROI",
            "features": [
                "Google Ads Management",
                "Facebook & Instagram Ads",
                "LinkedIn Advertising",
                "Display & Remarketing",
                "Shopping Ads",
                "Campaign Optimization"
            ],
            "process_steps": [
                {"step": 1, "title": "Research", "description": "Audience and keyword research"},
                {"step": 2, "title": "Setup", "description": "Campaign structure and ad creation"},
                {"step": 3, "title": "Launch", "description": "Launch campaigns across platforms"},
                {"step": 4, "title": "Monitor", "description": "Real-time monitoring and adjustments"},
                {"step": 5, "title": "Optimize", "description": "Continuous optimization for ROI"}
            ],
            "keywords": ["ppc", "google ads", "paid marketing", "facebook ads"]
        }
    ]
    await db.services.insert_many(services)

async def seed_cities():
    cities = [
        # Metro Cities
        {"id": "1", "name": "Delhi", "slug": "delhi", "state": "Delhi", "tier": "metro", "areas": ["Connaught Place", "Karol Bagh", "Nehru Place", "Dwarka", "Rohini"]},
        {"id": "2", "name": "Mumbai", "slug": "mumbai", "state": "Maharashtra", "tier": "metro", "areas": ["Andheri", "Bandra", "Powai", "Navi Mumbai", "Thane"]},
        {"id": "3", "name": "Bangalore", "slug": "bangalore", "state": "Karnataka", "tier": "metro", "areas": ["Koramangala", "Whitefield", "Indiranagar", "Electronic City", "HSR Layout"]},
        {"id": "4", "name": "Hyderabad", "slug": "hyderabad", "state": "Telangana", "tier": "metro", "areas": ["Hitech City", "Gachibowli", "Madhapur", "Banjara Hills", "Secunderabad"]},
        {"id": "5", "name": "Chennai", "slug": "chennai", "state": "Tamil Nadu", "tier": "metro", "areas": ["T Nagar", "Anna Nagar", "Velachery", "OMR", "Porur"]},
        {"id": "6", "name": "Kolkata", "slug": "kolkata", "state": "West Bengal", "tier": "metro", "areas": ["Salt Lake", "Park Street", "Ballygunge", "New Town", "Howrah"]},
        {"id": "7", "name": "Pune", "slug": "pune", "state": "Maharashtra", "tier": "metro", "areas": ["Hinjewadi", "Kothrud", "Viman Nagar", "Wakad", "Baner"]},
        
        # State Capitals & Major Cities
        {"id": "8", "name": "Noida", "slug": "noida", "state": "Uttar Pradesh", "tier": "tier1", "areas": ["Sector 62", "Sector 18", "Greater Noida", "Sector 142", "Film City"]},
        {"id": "9", "name": "Gurgaon", "slug": "gurgaon", "state": "Haryana", "tier": "tier1", "areas": ["Cyber City", "DLF Phase 1", "Golf Course Road", "Sohna Road", "MG Road"]},
        {"id": "10", "name": "Jaipur", "slug": "jaipur", "state": "Rajasthan", "tier": "tier1", "areas": ["Malviya Nagar", "Vaishali Nagar", "C-Scheme", "Mansarovar", "Jagatpura"]},
        {"id": "11", "name": "Lucknow", "slug": "lucknow", "state": "Uttar Pradesh", "tier": "tier1", "areas": ["Gomti Nagar", "Hazratganj", "Indira Nagar", "Aliganj", "Alambagh"]},
        {"id": "12", "name": "Chandigarh", "slug": "chandigarh", "state": "Punjab", "tier": "tier1", "areas": ["Sector 17", "Sector 35", "Mohali", "Panchkula", "Zirakpur"]},
        {"id": "13", "name": "Ahmedabad", "slug": "ahmedabad", "state": "Gujarat", "tier": "tier1", "areas": ["Satellite", "Vastrapur", "SG Highway", "Bodakdev", "Prahlad Nagar"]},
        {"id": "14", "name": "Surat", "slug": "surat", "state": "Gujarat", "tier": "tier1", "areas": ["Adajan", "Vesu", "Citylight", "Pal", "Rander"]},
        {"id": "15", "name": "Indore", "slug": "indore", "state": "Madhya Pradesh", "tier": "tier1", "areas": ["Vijay Nagar", "Palasia", "Rau", "Bypass Road", "Bhanwarkua"]},
        {"id": "16", "name": "Bhopal", "slug": "bhopal", "state": "Madhya Pradesh", "tier": "tier1", "areas": ["MP Nagar", "Arera Colony", "Koh-e-Fiza", "Hoshangabad Road", "Ayodhya Bypass"]},
        {"id": "17", "name": "Patna", "slug": "patna", "state": "Bihar", "tier": "tier1", "areas": ["Boring Road", "Kankarbagh", "Rajendra Nagar", "Danapur", "Patliputra"]},
        {"id": "18", "name": "Nagpur", "slug": "nagpur", "state": "Maharashtra", "tier": "tier1", "areas": ["Dharampeth", "Sadar", "Sitabuldi", "MIHAN", "Wardha Road"]},
        {"id": "19", "name": "Visakhapatnam", "slug": "visakhapatnam", "state": "Andhra Pradesh", "tier": "tier1", "areas": ["MVP Colony", "Madhurawada", "Gajuwaka", "Rushikonda", "Dwaraka Nagar"]},
        {"id": "20", "name": "Coimbatore", "slug": "coimbatore", "state": "Tamil Nadu", "tier": "tier1", "areas": ["RS Puram", "Saibaba Colony", "Peelamedu", "Ganapathy", "Singanallur"]},
        {"id": "21", "name": "Kochi", "slug": "kochi", "state": "Kerala", "tier": "tier1", "areas": ["Kakkanad", "Edappally", "Marine Drive", "Palarivattom", "Vytilla"]},
        {"id": "22", "name": "Thiruvananthapuram", "slug": "thiruvananthapuram", "state": "Kerala", "tier": "tier1", "areas": ["Technopark", "Kazhakootam", "Kesavadasapuram", "Vazhuthacaud", "Pattom"]},
        {"id": "23", "name": "Vadodara", "slug": "vadodara", "state": "Gujarat", "tier": "tier2", "areas": ["Alkapuri", "Sayajigunj", "Fatehgunj", "Manjalpur", "Gotri"]},
        {"id": "24", "name": "Rajkot", "slug": "rajkot", "state": "Gujarat", "tier": "tier2", "areas": ["Kalawad Road", "University Road", "150 Feet Ring Road", "Raiya Road", "Mavdi"]},
        {"id": "25", "name": "Guwahati", "slug": "guwahati", "state": "Assam", "tier": "tier2", "areas": ["Paltan Bazaar", "Ganeshguri", "Beltola", "Khanapara", "Guwahati Club"]},
        {"id": "26", "name": "Bhubaneswar", "slug": "bhubaneswar", "state": "Odisha", "tier": "tier2", "areas": ["Saheed Nagar", "Patia", "Chandrasekharpur", "Khandagiri", "Jaydev Vihar"]},
        {"id": "27", "name": "Ranchi", "slug": "ranchi", "state": "Jharkhand", "tier": "tier2", "areas": ["Hinoo", "Kanke", "Harmu", "Doranda", "Lalpur"]},
        {"id": "28", "name": "Raipur", "slug": "raipur", "state": "Chhattisgarh", "tier": "tier2", "areas": ["Shankar Nagar", "Devendra Nagar", "Kota", "Pandri", "Mowa"]},
        {"id": "29", "name": "Dehradun", "slug": "dehradun", "state": "Uttarakhand", "tier": "tier2", "areas": ["Rajpur Road", "Sahastradhara Road", "Clement Town", "Patel Nagar", "ISBT"]},
        {"id": "30", "name": "Shimla", "slug": "shimla", "state": "Himachal Pradesh", "tier": "tier2", "areas": ["Mall Road", "Sanjauli", "Lakkar Bazaar", "Summer Hill", "Tutikandi"]},
        {"id": "31", "name": "Jammu", "slug": "jammu", "state": "Jammu and Kashmir", "tier": "tier2", "areas": ["Residency Road", "Trikuta Nagar", "Bahu Plaza", "Gandhi Nagar", "Janipur"]},
        {"id": "32", "name": "Srinagar", "slug": "srinagar", "state": "Jammu and Kashmir", "tier": "tier2", "areas": ["Lal Chowk", "Rajbagh", "Jawahar Nagar", "Sonwar", "Dalgate"]},
        {"id": "33", "name": "Agra", "slug": "agra", "state": "Uttar Pradesh", "tier": "tier2", "areas": ["Sanjay Place", "Kamla Nagar", "Dayalbagh", "Sikandra", "Tajganj"]},
        {"id": "34", "name": "Varanasi", "slug": "varanasi", "state": "Uttar Pradesh", "tier": "tier2", "areas": ["Sigra", "Cantt", "Lanka", "Bhelupur", "Godowlia"]},
        {"id": "35", "name": "Kanpur", "slug": "kanpur", "state": "Uttar Pradesh", "tier": "tier2", "areas": ["Civil Lines", "Swaroop Nagar", "Kalyanpur", "Kidwai Nagar", "Kakadeo"]},
        {"id": "36", "name": "Allahabad", "slug": "allahabad", "state": "Uttar Pradesh", "tier": "tier2", "areas": ["Civil Lines", "Georgetown", "Kareli", "Naini", "Ashok Nagar"]},
        {"id": "37", "name": "Amritsar", "slug": "amritsar", "state": "Punjab", "tier": "tier2", "areas": ["Lawrence Road", "Mall Road", "Ranjit Avenue", "Chheharta", "Majitha Road"]},
        {"id": "38", "name": "Ludhiana", "slug": "ludhiana", "state": "Punjab", "tier": "tier2", "areas": ["Ferozepur Road", "Model Town", "Sarabha Nagar", "Civil Lines", "Pakhowal Road"]},
        {"id": "39", "name": "Jalandhar", "slug": "jalandhar", "state": "Punjab", "tier": "tier2", "areas": ["Model Town", "Civil Lines", "Nakodar Road", "Kapurthala Road", "Urban Estate"]},
        {"id": "40", "name": "Mysore", "slug": "mysore", "state": "Karnataka", "tier": "tier2", "areas": ["Saraswathipuram", "VV Mohalla", "Kuvempunagar", "Hebbal", "Vijayanagar"]},
        {"id": "41", "name": "Mangalore", "slug": "mangalore", "state": "Karnataka", "tier": "tier2", "areas": ["Kadri", "Kankanady", "Bejai", "Mallikatte", "Balmatta"]},
        {"id": "42", "name": "Hubli", "slug": "hubli", "state": "Karnataka", "tier": "tier2", "areas": ["Vidyanagar", "Gokul Road", "Unkal", "Keshwapur", "Navanagar"]},
        {"id": "43", "name": "Vijayawada", "slug": "vijayawada", "state": "Andhra Pradesh", "tier": "tier2", "areas": ["MG Road", "Benz Circle", "Governorpet", "Labbipet", "Patamata"]},
        {"id": "44", "name": "Tirupati", "slug": "tirupati", "state": "Andhra Pradesh", "tier": "tier2", "areas": ["Tirumala", "Renigunta", "Air Bypass Road", "Balaji Colony", "TP Area"]},
        {"id": "45", "name": "Madurai", "slug": "madurai", "state": "Tamil Nadu", "tier": "tier2", "areas": ["Anna Nagar", "KK Nagar", "Gomathipuram", "SS Colony", "Vilangudi"]},
        {"id": "46", "name": "Trichy", "slug": "trichy", "state": "Tamil Nadu", "tier": "tier2", "areas": ["Thillai Nagar", "KK Nagar", "Srirangam", "Cantonment", "Puthur"]},
        {"id": "47", "name": "Salem", "slug": "salem", "state": "Tamil Nadu", "tier": "tier2", "areas": ["Junction", "Fairlands", "Hasthampatti", "Ammapet", "Shevapet"]},
        {"id": "48", "name": "Kozhikode", "slug": "kozhikode", "state": "Kerala", "tier": "tier2", "areas": ["Mavoor Road", "Arayidathupalam", "West Hill", "Medical College", "Kunnamangalam"]},
        {"id": "49", "name": "Thrissur", "slug": "thrissur", "state": "Kerala", "tier": "tier2", "areas": ["Round", "Shornur Road", "East Fort", "Puzhakkal", "Medical College"]},
        {"id": "50", "name": "Kollam", "slug": "kollam", "state": "Kerala", "tier": "tier2", "areas": ["Asramam", "Chinnakada", "Pallimukku", "Kottiyam", "Karunagappally"]}
    ]
    await db.cities.insert_many(cities)

async def seed_testimonials():
    testimonials = [
        {
            "id": "1",
            "client_name": "Rajesh Kumar",
            "company": "TechStart Solutions",
            "rating": 5,
            "content": "PyTech Digital transformed our online presence completely. Their website design and digital marketing services helped us increase leads by 300%. Highly professional team!",
            "city": "Delhi"
        },
        {
            "id": "2",
            "client_name": "Priya Sharma",
            "company": "StyleHub Fashion",
            "rating": 5,
            "content": "Excellent branding services! They created a modern brand identity that perfectly captures our essence. The team was creative and delivered beyond expectations.",
            "city": "Mumbai"
        },
        {
            "id": "3",
            "client_name": "Amit Patel",
            "company": "FitLife Wellness",
            "rating": 5,
            "content": "Our mobile app developed by PyTech Digital has been a game changer. User-friendly interface and seamless performance. Great job!",
            "city": "Bangalore"
        },
        {
            "id": "4",
            "client_name": "Sneha Reddy",
            "company": "EduTech Academy",
            "rating": 5,
            "content": "Their enquiry generation services brought us quality leads consistently. ROI has been excellent and the team is always responsive.",
            "city": "Hyderabad"
        },
        {
            "id": "5",
            "client_name": "Vikram Singh",
            "company": "AutoParts India",
            "rating": 5,
            "content": "Professional, reliable, and result-oriented. PyTech Digital helped us rank on first page of Google for our key business terms.",
            "city": "Pune"
        }
    ]
    await db.testimonials.insert_many(testimonials)

async def seed_portfolio():
    portfolio = [
        {
            "id": "1",
            "title": "E-commerce Platform",
            "category": "Website Design",
            "description": "Modern e-commerce website with seamless checkout experience",
            "image_url": "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800",
            "city": "Mumbai"
        },
        {
            "id": "2",
            "title": "Mobile Banking App",
            "category": "App Development",
            "description": "Secure and user-friendly mobile banking application",
            "image_url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
            "city": "Bangalore"
        },
        {
            "id": "3",
            "title": "Brand Identity Design",
            "category": "Branding Services",
            "description": "Complete brand identity for luxury hospitality brand",
            "image_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
            "city": "Delhi"
        },
        {
            "id": "4",
            "title": "SEO Campaign Success",
            "category": "Digital Marketing Services",
            "description": "300% organic traffic growth in 6 months",
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
            "city": "Hyderabad"
        }
    ]
    await db.portfolio.insert_many(portfolio)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()