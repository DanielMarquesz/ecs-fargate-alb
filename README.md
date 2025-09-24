# AWS Sample: ECS + Fargate + Elastic Load Balance

This is a project focus on showing the power of this three resources together.


### ECS: 
Is a service fully managed of container orquestrations that helps to implant, manage and scale applications in containers in a efficienty way.

### Fargate: 

A serverless computing resource with payment on as you go that allow us to focus less on the servermanagement and more in our applications.


### ELB(Elastic Load Balancing): 
The application load balance distributes traffic of applications between server in a efficient way.

I run this example unsing a conteinirized image, if you wat to do the same just follow the next steps:

must have been installed: `aws cli && docker`

```
cd container/

## Compile the project

npm run node:build

## Login into aws ECR to deploy our image

aws ecr get-login-password --region <region> \
  | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com

## Build and tag

docker build -t my-app-repository:latest .
docker tag my-app-repository:latest <account>.dkr.ecr.<region>.amazonaws.com/my-app-repository:latest

## Push the image

docker push <account>.dkr.ecr.<region>.amazonaws.com/my-app-repository:latest

## deploy it(change the profile if you need)

cdk deploy --all --require-approval never
```

After the deploy you can run a script in``ecs-fargate-alb/container/src/script.ts`` with your endpoint to put our scale configuration to work.

As i hit the 20% of CPU utilization i have my container deployed with another instance:

CPU:
![imgs/cpuUtilization.jpeg]

Auto Scale:
![imgs/autoScale.jpeg]
![imgs/autoScale2.jpeg]

