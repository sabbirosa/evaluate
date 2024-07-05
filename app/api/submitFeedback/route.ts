import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, connection, details, feedback, rating } =
      await request.json();

    const values = [
      name || "Not Provided",
      email || "Not Provided",
      connection || "Not Provided",
      details || "Not Provided",
      feedback || "Not Provided",
      rating || "Not Provided",
    ];

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL!,
        private_key: (process.env.GOOGLE_PRIVATE_KEY as string).replace(
          /\\n/g,
          "\n"
        ),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: "Evaluations!A1:F1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });

    return NextResponse.json(
      { message: "Evaluation submission Successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting evaluation:", error);
    return NextResponse.json(
      { message: "Evaluation submission failed!" },
      { status: 500 }
    );
  }
}
