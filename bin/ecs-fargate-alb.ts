#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcsFargateAlbStack } from '../lib/ecs-fargate-alb-stack';
import { RepositoryStack } from '../lib/repository-stack';

const app = new cdk.App();

const repositoryStack = new RepositoryStack(app, 'RepositoryStack')

new EcsFargateAlbStack(app, 'EcsFargateAlbStack', repositoryStack.repository, {});