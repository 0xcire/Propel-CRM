FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

COPY . .

RUN npm install

RUN npx playwright install --with-deps

CMD npm run test --workspace=e2e