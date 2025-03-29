// import { NextRequest, NextResponse } from "next/server";
// import { CognitoIdentityProviderClient, AssociateSoftwareTokenCommand } from "@aws-sdk/client-cognito-identity-provider";
// const { AWS_REGION } = process.env;

// const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });

// export async function POST(req: NextRequest) {
//     console.log("AWS_REGION",AWS_REGION);
//     try {
//         const { session } = await req.json();

//         console.log("session", session);

//         if (!session) {
//             return NextResponse.json({ success: false, message: "Missing session" }, { status: 400 });
//         }

//         const command = new AssociateSoftwareTokenCommand({ Session: session });  // 🔹 Fix: Wrap session in object

//         const response = await cognitoClient.send(command);

//         return NextResponse.json({ success: true, secretCode: response.SecretCode, session: response.Session });
//     } catch (error) {
//         console.error("Error setting up MFA:", error);
//         return NextResponse.json({ success: false, message: "MFA setup failed!" }, { status: 400 });
//     }
// }


import { NextRequest, NextResponse } from "next/server";
import { CognitoIdentityProviderClient, AssociateSoftwareTokenCommand } from "@aws-sdk/client-cognito-identity-provider";

const { AWS_REGION } = process.env;
const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });

export async function POST(req: NextRequest) {
    console.log("AWS_REGION", AWS_REGION);
    try {
        const { session } = await req.json();
        console.log("session", session);

        if (!session) {
            return NextResponse.json({ success: false, message: "Missing session" }, { status: 400 });
        }

        const command = new AssociateSoftwareTokenCommand({ Session: session });
        const response = await cognitoClient.send(command);

        return NextResponse.json({ success: true, secretCode: response.SecretCode, session: response.Session });
    } catch (error: any) {
        console.error("Error setting up MFA:", error);

        if (error.name === "ConcurrentModificationException") {
            console.warn("MFA setup already in progress, retrying in 2 seconds...");
            
            // Wait 2 seconds before retrying
            await new Promise((resolve) => setTimeout(resolve, 2000));

            return NextResponse.json({ success: false, message: "MFA setup is already in progress. Please try again in a few seconds." }, { status: 429 });
        }

        return NextResponse.json({ success: false, message: "MFA setup failed!" }, { status: 400 });
    }
}

