#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Smart Recipe Finder - API Diagnostics"
echo "========================================"
echo ""

# 1. Check if backend is running
echo -e "${YELLOW}1. Checking backend health...${NC}"
HEALTH=$(curl -s http://localhost:5000/)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend is running${NC}"
    echo "   Response: $HEALTH"
else
    echo -e "${RED}✗ Backend is NOT running${NC}"
    echo "   Start backend with: cd backend && python run.py"
    exit 1
fi
echo ""

# 2. Test CORS preflight
echo -e "${YELLOW}2. Testing CORS preflight (OPTIONS)...${NC}"
CORS_RESULT=$(curl -s -o /dev/null -w "%{http_code}" \
    -X OPTIONS http://localhost:5000/api/meal-plans \
    -H "Origin: http://localhost:5173" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: Authorization")

if [ "$CORS_RESULT" == "200" ]; then
    echo -e "${GREEN}✓ CORS preflight successful${NC}"
else
    echo -e "${RED}✗ CORS preflight failed (HTTP $CORS_RESULT)${NC}"
fi
echo ""

# 3. Get credentials
echo -e "${YELLOW}3. Testing authentication...${NC}"
read -p "Enter username: " USERNAME
read -sp "Enter password: " PASSWORD
echo ""

# Login with username_or_email field
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"username_or_email\": \"$USERNAME\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$')

if [ -z "$TOKEN" ]; then
    echo -e "${RED}✗ Login failed${NC}"
    echo "   Response: $LOGIN_RESPONSE"
    exit 1
else
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "   Token: ${TOKEN:0:50}..."
fi
echo ""

# 4. Test meal-plans endpoint
echo -e "${YELLOW}4. Testing GET /api/meal-plans...${NC}"
MEAL_PLANS=$(curl -s http://localhost:5000/api/meal-plans \
    -H "Authorization: Bearer $TOKEN")

echo "Response: $MEAL_PLANS"
echo ""

# 5. Test adding a meal plan
echo -e "${YELLOW}5. Testing POST /api/meal-plans...${NC}"
ADD_RESULT=$(curl -s -X POST http://localhost:5000/api/meal-plans \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "recipe_id": "52772",
        "recipe_name": "Test Recipe",
        "recipe_image": "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
        "planned_date": "2025-10-15",
        "meal_type": "dinner"
    }')

echo "Response: $ADD_RESULT"
echo ""

# Summary
echo "========================================"
echo -e "${GREEN}✅ Diagnostics Complete!${NC}"
echo ""
echo "If all tests passed, the API is working correctly."
echo "If meal planner still shows CORS error in browser:"
echo "  1. Clear browser localStorage (F12 > Application > Clear)"
echo "  2. Login again to get fresh token"
echo "  3. Check browser console for detailed error"