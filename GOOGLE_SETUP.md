# How to Set Up Google Sign-In

1.  **Go to Google Cloud Console**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2.  **Create a New Project**: Call it "Effectify".
3.  **Go to "APIs & Services" > "Credentials"**.
4.  **Configure OAuth Consent Screen**:
    *   Select **External**.
    *   Fill in App Name ("Effectify") and Support Email.
    *   Click Save/Continue.
5.  **Create Credentials**:
    *   Click **+ CREATE CREDENTIALS** -> **OAuth Client ID**.
    *   Application Type: **Web application**.
    *   Name: "Effectify Supabase".
    *   **Authorized Redirect URIs**:
        *   You need to get this from your Supabase Dashboard!
        *   Go to **Supabase > Authentication > Providers > Google**.
        *   Copy the **Callback URL**.
        *   Paste it into Google Cloud.
6.  **Copy Keys**:
    *   Google will give you a **Client ID** and **Client Secret**.
    *   Copy these.
7.  **Paste into Supabase**:
    *   Go back to **Supabase > Authentication > Providers > Google**.
    *   Paste the Client ID and Secret.
    *   Toggle **Enable Sign in with Google** to ON.
    *   Click Save.
