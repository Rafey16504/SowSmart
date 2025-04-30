FROM public.ecr.aws/lambda/python:3.9

# Copy the model and inference code into Lambda task root
COPY inference.py ${LAMBDA_TASK_ROOT}
COPY plant_disease_prediction_model.h5 ${LAMBDA_TASK_ROOT}

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Set the Lambda function handler
CMD ["inference.lambda_handler"]
    