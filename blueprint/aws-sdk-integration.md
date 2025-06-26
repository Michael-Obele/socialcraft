# AWS SDK for JavaScript (v3) Integration Guide

This document provides a guide for setting up and using the AWS SDK for JavaScript (v3) for the SocialCraft project, focusing on the Bedrock, S3, and Rekognition services.

## 1. Core Concepts

The AWS SDK for JavaScript v3 is modular. Each service has its own package, which helps to keep bundle sizes small. The basic workflow for using a service is:

1.  **Install the client package**: e.g., `@aws-sdk/client-s3`.
2.  **Import the client and command**: Import the specific client for the service and the command you want to execute.
3.  **Instantiate the client**: Create a new client instance, specifying the AWS region.
4.  **Create and send the command**: Instantiate the command with the required parameters and send it using the client.

Credentials should be configured via environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`), which the SDK will automatically detect.

## 2. Amazon Bedrock Integration

Amazon Bedrock is used for the core AI image generation.

### Installation

```bash
bun add @aws-sdk/client-bedrock-runtime
# The main client for invoking models is in bedrock-runtime
bun add @aws-sdk/client-bedrock
```

### Usage

The primary client for invoking models is `BedrockRuntimeClient`.

```typescript
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

async function generateImage(prompt: string) {
  const params = {
    modelId: "stability.stable-diffusion-xl-v1",
    contentType: "application/json",
    accept: "image/png",
    body: JSON.stringify({
      text_prompts: [{ text: prompt }],
      cfg_scale: 7,
      seed: 0,
      steps: 30,
    }),
  };

  const command = new InvokeModelCommand(params);

  try {
    const response = await client.send(command);
    const imageBuffer = Buffer.from(response.body as Uint8Array);
    return imageBuffer;
  } catch (error) {
    console.error("Error generating image with Bedrock:", error);
    throw error;
  }
}
```

**Key Features from Docs:**

*   **S3 Asset Referencing**: Models like Amazon Nova can directly reference images and documents in S3, which could be useful for future features like image-to-image generation.
*   **Asynchronous Invocation**: For long-running generation tasks, Bedrock supports asynchronous operations (`Start`, `List`, `Get`), which could be implemented for a batch generation feature.
*   **Guardrails**: Bedrock has built-in Guardrails, including image content filtering, which will be a crucial part of the content moderation pipeline.

## 3. Amazon S3 Integration

Amazon S3 is used for storing the generated images.

### Installation

```bash
bun add @aws-sdk/client-s3
```

### Usage

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({ region: "us-east-1" });

async function uploadImageToS3(imageBuffer: Buffer, fileName: string) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: imageBuffer,
    ContentType: "image/png",
    ACL: "public-read", // Or use pre-signed URLs for private access
  };

  const command = new PutObjectCommand(params);

  try {
    await client.send(command);
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw error;
  }
}
```

**Key Features from Docs:**

*   **S3 Express One Zone**: For high-performance, single-Availability Zone storage, which could be an option for temporary or cached assets.
*   **Access Grants**: S3 Access Grants can be used for fine-grained access control, which will be important if user-specific galleries are implemented.
*   **Replication Status**: The SDK supports validating the replication status of objects, which is useful for ensuring data durability in multi-region setups.

## 4. Amazon Rekognition Integration

Amazon Rekognition is used for content moderation of the generated images.

### Installation

```bash
bun add @aws-sdk/client-rekognition
```

### Usage

```typescript
import { RekognitionClient, DetectModerationLabelsCommand } from "@aws-sdk/client-rekognition";

const client = new RekognitionClient({ region: "us-east-1" });

async function moderateImage(imageBuffer: Buffer): Promise<boolean> {
  const params = {
    Image: { Bytes: imageBuffer },
  };

  const command = new DetectModerationLabelsCommand(params);

  try {
    const response = await client.send(command);
    // If ModerationLabels array is empty, content is considered safe
    return response.ModerationLabels?.length === 0;
  } catch (error) {
    console.error("Error during image moderation:", error);
    // Fail-safe: assume unsafe if moderation fails
    return false;
  }
}
```

This information will be used to expand the `02-tech-stack-and-setup.md` and `04-feature-implementation.md` blueprints with more detailed, actionable steps for setting up the AWS SDK and integrating these services.