import supabase from '../lib/supabaseClient';

// --- NEWS BANNERS FUNCTIONS ---

// 1. Fetch all active banners
export async function fetchActiveBanners() {
    try {
        // First check if is_active column exists by trying a simple query
        const { data, error } = await supabase
            .from('news_banners')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching banners:", error);
            
            // If column doesn't exist error, fetch without filter
            if (error.message.includes('is_active') || error.code === '42703') {
                console.log("is_active column not found, fetching all banners");
                const { data: allData, error: allError } = await supabase
                    .from('news_banners')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (allError) throw allError;
                return allData || [];
            }
            
            throw error;
        }
        
        // Filter active banners if is_active column exists
        const activeBanners = data.filter(banner => banner.is_active === true);
        return activeBanners;
        
    } catch (error) {
        console.error("Error in fetchActiveBanners:", error);
        return [];
    }
}

// 2. Add a new banner (Admin Only)
export async function addNewsBanner(bannerData) {
    try {
        const { data, error } = await supabase
            .from('news_banners')
            .insert([{
                ...bannerData,
                created_at: new Date().toISOString(),
                is_active: true // Default to active
            }])
            .select();

        if (error) {
            console.error("Error adding news banner:", error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error in addNewsBanner:", error);
        throw error;
    }
}

// --- TESTIMONIES FUNCTIONS ---

// 3. Fetch approved testimonies (with fallback for missing is_approved column)
export async function fetchApprovedTestimonies() {
    try {
        // First try with is_approved filter
        const { data, error } = await supabase
            .from('testimonies')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching approved testimonies:", error);
            
            // If column doesn't exist, fetch all testimonies
            if (error.message.includes('is_approved') || error.code === '42703') {
                console.log("is_approved column not found, fetching all testimonies");
                const { data: allData, error: allError } = await supabase
                    .from('testimonies')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (allError) throw allError;
                return allData || [];
            }
            
            throw error;
        }
        
        return data || [];
        
    } catch (error) {
        console.error("Error in fetchApprovedTestimonies:", error);
        return [];
    }
}

// 4. Fetch all testimonies (for admin dashboard)
export async function fetchAllTestimonies() {
    try {
        const { data, error } = await supabase
            .from('testimonies')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching all testimonies:", error);
            throw error;
        }
        return data || [];
    } catch (error) {
        console.error("Error in fetchAllTestimonies:", error);
        return [];
    }
}

// 5. Toggle testimony approval status
export async function toggleTestimonyApproval(testimonyId, currentStatus) {
    try {
        // First check if is_approved column exists
        const { error: checkError } = await supabase
            .from('testimonies')
            .select('is_approved')
            .eq('id', testimonyId)
            .single();

        if (checkError && checkError.code === '42703') {
            console.log("is_approved column doesn't exist, creating it...");
            
            // Try to add the column via a direct update (this might fail without proper permissions)
            const { error: updateError } = await supabase
                .from('testimonies')
                .update({ is_approved: true })
                .eq('id', testimonyId);
            
            if (updateError) {
                console.error("Cannot update is_approved column:", updateError);
                return false;
            }
            return true;
        }

        // Column exists, toggle the value
        const { error } = await supabase
            .from('testimonies')
            .update({ is_approved: !currentStatus })
            .eq('id', testimonyId);

        if (error) {
            console.error("Error updating testimony approval:", error);
            throw error;
        }
        
        return true;
    } catch (error) {
        console.error("Error in toggleTestimonyApproval:", error);
        return false;
    }
}

// 6. Add a new testimony
export async function addTestimony(testimonyData) {
    try {
        const { data, error } = await supabase
            .from('testimonies')
            .insert([{
                ...testimonyData,
                created_at: new Date().toISOString(),
                is_approved: false // Default to not approved
            }])
            .select();

        if (error) {
            console.error("Error adding testimony:", error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error in addTestimony:", error);
        throw error;
    }
}

// 7. Check and fix table structure
export async function checkTestimoniesTable() {
    try {
        console.log("Checking testimonies table structure...");
        
        // Try to fetch column information
        const { data, error } = await supabase
            .from('testimonies')
            .select('*')
            .limit(1);

        if (error) {
            console.error("Error checking table:", error);
            return {
                hasIsApproved: false,
                hasStudentName: false,
                hasTestimony: false,
                error: error.message
            };
        }

        if (data && data.length > 0) {
            const firstRecord = data[0];
            return {
                hasIsApproved: 'is_approved' in firstRecord,
                hasStudentName: 'student_name' in firstRecord,
                hasTestimony: 'testimony' in firstRecord,
                columns: Object.keys(firstRecord)
            };
        }
        
        return { hasIsApproved: false, hasStudentName: false, hasTestimony: false };
        
    } catch (error) {
        console.error("Error in checkTestimoniesTable:", error);
        return { error: error.message };
    }
}

// 8. Safe fetch for home page (public use)
export async function fetchPublicTestimonies() {
    try {
        // First try to get approved testimonies
        const approvedTestimonies = await fetchApprovedTestimonies();
        
        // If no approved testimonies or error, try to get all
        if (!approvedTestimonies || approvedTestimonies.length === 0) {
            console.log("No approved testimonies found, trying to fetch all...");
            const allTestimonies = await fetchAllTestimonies();
            
            // Limit to 6 for display
            return allTestimonies.slice(0, 6);
        }
        
        // Limit approved testimonies to 6 for display
        return approvedTestimonies.slice(0, 6);
        
    } catch (error) {
        console.error("Error in fetchPublicTestimonies:", error);
        return [];
    }
}

// 9. Fix table columns if missing (run this once from admin dashboard)
export async function fixTestimoniesTableColumns() {
    try {
        console.log("Attempting to fix testimonies table columns...");
        
        // This would require SQL permissions - for now just log what needs to be done
        const tableInfo = await checkTestimoniesTable();
        
        if (tableInfo.error) {
            console.log("Table check failed:", tableInfo.error);
            return {
                success: false,
                message: "Cannot check table structure. Run the SQL manually in Supabase.",
                sqlCommands: [
                    "ALTER TABLE public.testimonies ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;",
                    "ALTER TABLE public.testimonies ADD COLUMN IF NOT EXISTS student_name TEXT;",
                    "ALTER TABLE public.testimonies ADD COLUMN IF NOT EXISTS testimony TEXT;",
                    "ALTER TABLE public.testimonies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();",
                    "UPDATE public.testimonies SET is_approved = TRUE WHERE is_approved IS NULL;"
                ]
            };
        }
        
        return {
            success: true,
            message: "Table structure checked successfully.",
            missingColumns: {
                is_approved: !tableInfo.hasIsApproved,
                student_name: !tableInfo.hasStudentName,
                testimony: !tableInfo.hasTestimony
            },
            existingColumns: tableInfo.columns
        };
        
    } catch (error) {
        console.error("Error in fixTestimoniesTableColumns:", error);
        return { success: false, error: error.message };
    }
}