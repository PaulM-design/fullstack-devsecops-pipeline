.PHONY: install test lint run compose terraform-check

install:
	python -m pip install -e "api[dev]"
	cd web && npm install

test:
	pytest api/tests
	cd web && npm test -- --run

lint:
	ruff check api
	cd web && npm run lint

run:
	uvicorn app.main:app --app-dir api --reload

compose:
	docker compose up --build

terraform-check:
	terraform -chdir=infra/terraform fmt -check -recursive
	terraform -chdir=infra/terraform init -backend=false
	terraform -chdir=infra/terraform validate

