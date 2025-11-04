

export type TournamentRegistrationList=  Array<{
    userId: number;
    userName: string;
    tournamentSportsName: string;
    userProfilePhoto: string;
    registeredCategories: Array<{
        registrationId: number;
        category: {
            id: number;
            tournamentId: number;
            organizerId: number;
            divisions_label: string;
            divisions_alias: string;
            ageBracket: {
                id: number;
                label: string;
                minAge: number;
                maxAge: number;
                notes: string;
            };
        gender_type: string;
        format_type: string;
        waiting_list: boolean;
        maximum_participants: number;
        entry_fee: string;
        created_at: string;
        updated_at: string
    
        };
        ageBracket: {
            id: number;
            label: string;
            minAge: number;
            maxAge: number;
            notes: string;
        };
        registeredAt: string;
    }>;
    totalCategoriesCount: number; 
    }>;