import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create one admin client to use for all server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// This single GET function will handle ALL of your endpoints
export async function GET(
  request: NextRequest,
  // We define the type of the entire second argument object
  { params }: { params: Promise<{ id: string; resource: string }> }
) {
  try {
    const { id, resource } = await params;

    // Use a switch statement to handle different resource requests
    switch (resource) {
      // Handles GET /api/merchant/{id}/owner-name
      case 'owner-name': {
        const { data, error } = await supabaseAdmin
          .from('merchant_data')
          .select('owner_name')
          .eq('id', id)
          .single();
        if (error) throw error;
        return NextResponse.json({
          id,
          owner_name: data.owner_name,
        });
      }

      // Handles GET /api/merchant/{id}/business-info
      case 'business-info': {
        const fields =
          'business_name, outlet_name, outlet_address, outlet_type, outlet_category, ssm_number, merchant_id, open_time, close_time, delivery_radius, service_type, created_at';
        const { data, error } = await supabaseAdmin
          .from('merchant_data')
          .select(fields)
          .eq('id', id)
          .single();
        if (error) throw error;
        return NextResponse.json({
          id,
          business_info: data,
        });
      }

      // Handles GET /api/merchant/{id}/personal-info
      case 'personal-info': {
        const fields = 'owner_name, owner_id, dob, nationality, owner_email, owner_phone';
        const { data, error } = await supabaseAdmin
          .from('merchant_data')
          .select(fields)
          .eq('id', id)
          .single();
        if (error) throw error;
        return NextResponse.json({
          id,
          personal_info: data,
        });
      }

      // Handles GET /api/merchant/{id}/company-contact
      case 'company-contact': {
        const fields = 'company_email, company_phone, support_contact';
        const { data, error } = await supabaseAdmin
          .from('merchant_data')
          .select(fields)
          .eq('id', id)
          .single();
        if (error) throw error;
        return NextResponse.json({
          id,
          company_contact: data,
        });
      }

      // Handles GET /api/merchant/{id}/bank-info
      case 'bank-info': {
        const fields = 'bank_name, bank_account, account_holder, account_type';
        const { data, error } = await supabaseAdmin
          .from('merchant_data')
          .select(fields)
          .eq('id', id)
          .single();
        if (error) throw error;

        // Add the public URL for the proof of account
        const filePath = `${id}_proof_of_account.pdf`;
        const { data: urlData } = supabaseAdmin.storage
          .from('pdfs')
          .getPublicUrl(filePath);

        const bankInfo = {
          ...data,
          proof_of_account_url: urlData.publicUrl,
        };

        return NextResponse.json({
          id,
          bank_info: bankInfo,
        });
      }
      
      // Handles GET /api/merchant/{id}/documents
      case 'documents': {
        const fileNames = {
          business_license: `${id}_business_license.pdf`,
          halal_cert: `${id}_halal_cert.pdf`,
          ic_passport: `${id}_ic_passport.pdf`,
          menu_photos: `${id}_menu_photos.pdf`,
          outlet_photos: `${id}_outlet_photos.pdf`,
          signed_agreement: `${id}_signed_agreement.pdf`,
          ssm_cert: `${id}_ssm_cert.pdf`,
          bank_statement: `${id}_bank_statement.pdf`,
        };

        const documentUrls: Record<string, string | null> = {};
        for (const [docType, fileName] of Object.entries(fileNames)) {
          const { data } = supabaseAdmin.storage.from('pdfs').getPublicUrl(fileName);
          documentUrls[docType] = data.publicUrl;
        }

        return NextResponse.json({
          id,
          documents: documentUrls,
        });
      }

      // Handles GET /api/merchant/{id}/menu
      case 'menu': {
        const filePath = `${id}_json_menu.json`;
        const { data, error } = await supabaseAdmin.storage.from('pdfs').download(filePath);
        if (error) {
            console.error('Menu download error:', error);
            return NextResponse.json({ error: 'Menu file not found' }, { status: 404 });
        }
        const jsonData = JSON.parse(await data.text());
        return NextResponse.json({
            id,
            menu: jsonData,
        });
      }

      case 'full-profile': {
        const fields =
          'business_name, outlet_name, outlet_address, outlet_type, outlet_category, ssm_number, merchant_id, open_time, close_time, delivery_radius, service_type, owner_name, owner_id, dob, nationality, owner_email, owner_phone, position, company_email, company_phone, support_contact, bank_name, bank_account, account_holder, account_type';
        const { data, error } = await supabaseAdmin
          .from('merchant_data')
          .select(fields)
          .eq('id', id) 
          .single();
        
        if (error) throw error;
        
        return NextResponse.json({
          id,
          profile: data,
        });
      }

      // Default case for any other resource
      default:
        return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
  } catch (error: any) {
    // General error handler
    const is404 = error.code === 'PGRST116'; // Supabase code for "not found" on .single()
    return NextResponse.json(
      { error: is404 ? 'Merchant not found' : 'Internal Server Error', details: error.message },
      { status: is404 ? 404 : 500 }
    );
  }
}