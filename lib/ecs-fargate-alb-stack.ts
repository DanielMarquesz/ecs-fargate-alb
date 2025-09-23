import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as apigw2 from "aws-cdk-lib/aws-apigatewayv2";
import { HttpAlbIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";

export const PREFIX = 'my-app'

export class EcsFargateAlbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const defaultVpc = new ec2.Vpc(this, "Vpc", {
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
      maxAzs: 2,
      vpcName: `${PREFIX}-vpc`,
      restrictDefaultSecurityGroup: false
    })

    const cluster: ecs.Cluster = new ecs.Cluster(this, "Cluster", {
      vpc: defaultVpc,
      clusterName: `${PREFIX}-cluster`
    })


    const service = new ApplicationLoadBalancedFargateService(this, "Service", {
      serviceName: `${PREFIX}-service`,
      loadBalancerName: `${PREFIX}-alb`,
      cluster,
      memoryLimitMiB: 512,
      cpu: 256, //0.25
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest"),
        environment: {
          ENV_VAR_1: "value1",
          ENV_VAR_2: "value2",
        },
        containerPort: 80
      },
      desiredCount: 2,
      publicLoadBalancer: false
    })

    service.targetGroup.configureHealthCheck({
      path: "/"
    })

    const scaling = service.service.autoScaleTaskCount({
      maxCapacity: 5,
      minCapacity: 1
    })

    scaling.scaleOnCpuUtilization("CpuScaling", {targetUtilizationPercent: 70})
    scaling.scaleOnMemoryUtilization("RamScaling", {targetUtilizationPercent: 70})

    const httpApi = new apigw2.HttpApi(this, "HttpApi", { apiName: `${PREFIX}-api` });
    
    httpApi.addRoutes({
      path: "/",
      methods: [apigw2.HttpMethod.GET],
      integration: new HttpAlbIntegration("AlbIntegration", service.listener)
    })
  }
}
