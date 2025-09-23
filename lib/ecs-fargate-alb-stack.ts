import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export const PREFIX = 'my-app'

export class EcsFargateAlbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const defaultVpc = new ec2.Vpc(this, "Vpc", {
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
      maxAzs: 2,
      vpcName: `${PREFIX}-vpc`
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
      desiredCount: 2
    })

    service.targetGroup.configureHealthCheck({
      path: "/"
    })
  }
}
