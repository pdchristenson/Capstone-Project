#fastapi
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#routers
from routers.query_routes import router as query_router
from routers.disaster_routes import router as disaster_router
from routers.image_routes import router as image_router
from routers.download_routes import router as download_router

#initialize app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(query_router)
app.include_router(disaster_router)
app.include_router(image_router)
app.include_router(download_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Midgard Raven API. To access the API documentation, please visit /docs."}

#to run app, use command: uvicorn main:app --reload
#alternative command: python -m uvicorn main:app --reload
#to access the app documentation, attach /docs to the url
