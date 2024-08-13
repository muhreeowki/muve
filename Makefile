build-backend:
	pip3 install -r requirements.txt
build-frontend:
	cd frontend && npm install && cd ..
	npm run build

