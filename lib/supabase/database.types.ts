export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academic_status: {
        Row: {
          code: string
          id: number
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          id?: never
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          id?: never
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      availability_options: {
        Row: {
          code: string
          id: number
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          id?: never
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          id?: never
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      certification_types: {
        Row: {
          code: string
          id: number
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          id?: never
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          id?: never
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      certifications: {
        Row: {
          certification_type_id: number | null
          created_at: string
          credential_url: string | null
          id: string
          institution: string | null
          issue_date: string | null
          name: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          certification_type_id?: number | null
          created_at?: string
          credential_url?: string | null
          id?: string
          institution?: string | null
          issue_date?: string | null
          name: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          certification_type_id?: number | null
          created_at?: string
          credential_url?: string | null
          id?: string
          institution?: string | null
          issue_date?: string | null
          name?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_certification_type_id_fkey"
            columns: ["certification_type_id"]
            isOneToOne: false
            referencedRelation: "certification_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          id: string
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          id: string
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      education: {
        Row: {
          academic_status_id: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean
          is_primary: boolean
          profile_id: string
          start_date: string | null
          study_field_id: number | null
          university_id: number | null
          updated_at: string
        }
        Insert: {
          academic_status_id?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          is_primary?: boolean
          profile_id: string
          start_date?: string | null
          study_field_id?: number | null
          university_id?: number | null
          updated_at?: string
        }
        Update: {
          academic_status_id?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          is_primary?: boolean
          profile_id?: string
          start_date?: string | null
          study_field_id?: number | null
          university_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_academic_status_id_fkey"
            columns: ["academic_status_id"]
            isOneToOne: false
            referencedRelation: "academic_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_study_field_id_fkey"
            columns: ["study_field_id"]
            isOneToOne: false
            referencedRelation: "study_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      evidences: {
        Row: {
          created_at: string
          id: string
          label: string
          profile_id: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          profile_id: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          profile_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experience_types: {
        Row: {
          code: string
          id: number
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          id?: never
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          id?: never
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company_name: string
          created_at: string
          description: string | null
          end_date: string | null
          experience_type_id: number | null
          id: string
          is_current: boolean
          profile_id: string
          role_title: string
          sector_id: number | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          experience_type_id?: number | null
          id?: string
          is_current?: boolean
          profile_id: string
          role_title: string
          sector_id?: number | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          experience_type_id?: number | null
          id?: string
          is_current?: boolean
          profile_id?: string
          role_title?: string
          sector_id?: number | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_experience_type_id_fkey"
            columns: ["experience_type_id"]
            isOneToOne: false
            referencedRelation: "experience_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiences_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          created_at: string
          id: string
          language_id: number
          proficiency_level_id: number
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language_id: number
          proficiency_level_id: number
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language_id?: number
          proficiency_level_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "languages_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "languages_proficiency_level_id_fkey"
            columns: ["proficiency_level_id"]
            isOneToOne: false
            referencedRelation: "proficiency_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "languages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      languages_catalog: {
        Row: {
          id: number
          is_active: boolean
          iso_code: string
          name: string
          sort_order: number
        }
        Insert: {
          id?: never
          is_active?: boolean
          iso_code: string
          name: string
          sort_order?: number
        }
        Update: {
          id?: never
          is_active?: boolean
          iso_code?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      opportunity_types: {
        Row: {
          code: string
          id: number
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          id?: never
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          id?: never
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      preference_opportunity_types: {
        Row: {
          opportunity_type_id: number
          profile_id: string
        }
        Insert: {
          opportunity_type_id: number
          profile_id: string
        }
        Update: {
          opportunity_type_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "preference_opportunity_types_opportunity_type_id_fkey"
            columns: ["opportunity_type_id"]
            isOneToOne: false
            referencedRelation: "opportunity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "preference_opportunity_types_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "preferences"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      preference_sectors: {
        Row: {
          profile_id: string
          sector_id: number
        }
        Insert: {
          profile_id: string
          sector_id: number
        }
        Update: {
          profile_id?: string
          sector_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "preference_sectors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "preferences"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "preference_sectors_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      preference_work_modalities: {
        Row: {
          profile_id: string
          work_modality_id: number
        }
        Insert: {
          profile_id: string
          work_modality_id: number
        }
        Update: {
          profile_id?: string
          work_modality_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "preference_work_modalities_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "preferences"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "preference_work_modalities_work_modality_id_fkey"
            columns: ["work_modality_id"]
            isOneToOne: false
            referencedRelation: "work_modalities"
            referencedColumns: ["id"]
          },
        ]
      }
      preferences: {
        Row: {
          availability_option_id: number | null
          created_at: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          availability_option_id?: number | null
          created_at?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          availability_option_id?: number | null
          created_at?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "preferences_availability_option_id_fkey"
            columns: ["availability_option_id"]
            isOneToOne: false
            referencedRelation: "availability_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_settings: {
        Row: {
          created_at: string
          profile_id: string
          profile_visibility: string
          show_contact_email: boolean
          show_contact_phone: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          profile_id: string
          profile_visibility?: string
          show_contact_email?: boolean
          show_contact_phone?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          profile_id?: string
          profile_visibility?: string
          show_contact_email?: boolean
          show_contact_phone?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "privacy_settings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      proficiency_levels: {
        Row: {
          code: string
          id: number
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          id?: never
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          id?: never
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          academic_status_id: number | null
          bio: string | null
          country_id: string | null
          created_at: string
          email: string
          full_name: string
          headline: string | null
          id: string
          marketing_consent: boolean
          phone: string | null
          profile_photo_url: string | null
          referral_source_id: number | null
          study_field_id: number | null
          terms_accepted_at: string
          university_id: number | null
          updated_at: string
          video_pitch_url: string | null
        }
        Insert: {
          academic_status_id?: number | null
          bio?: string | null
          country_id?: string | null
          created_at?: string
          email: string
          full_name: string
          headline?: string | null
          id: string
          marketing_consent?: boolean
          phone?: string | null
          profile_photo_url?: string | null
          referral_source_id?: number | null
          study_field_id?: number | null
          terms_accepted_at: string
          university_id?: number | null
          updated_at?: string
          video_pitch_url?: string | null
        }
        Update: {
          academic_status_id?: number | null
          bio?: string | null
          country_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          headline?: string | null
          id?: string
          marketing_consent?: boolean
          phone?: string | null
          profile_photo_url?: string | null
          referral_source_id?: number | null
          study_field_id?: number | null
          terms_accepted_at?: string
          university_id?: number | null
          updated_at?: string
          video_pitch_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_academic_status_id_fkey"
            columns: ["academic_status_id"]
            isOneToOne: false
            referencedRelation: "academic_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_referral_source_id_fkey"
            columns: ["referral_source_id"]
            isOneToOne: false
            referencedRelation: "referral_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_study_field_id_fkey"
            columns: ["study_field_id"]
            isOneToOne: false
            referencedRelation: "study_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      project_types: {
        Row: {
          code: string
          id: number
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          id?: never
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          id?: never
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          profile_id: string
          project_type_id: number | null
          start_date: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          profile_id: string
          project_type_id?: number | null
          start_date?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          profile_id?: string
          project_type_id?: number | null
          start_date?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_project_type_id_fkey"
            columns: ["project_type_id"]
            isOneToOne: false
            referencedRelation: "project_types"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_sources: {
        Row: {
          code: string
          id: number
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          id?: never
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          id?: never
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      sectors: {
        Row: {
          code: string
          id: number
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          id?: never
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          id?: never
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string
          id: string
          name: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_fields: {
        Row: {
          id: number
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          id?: never
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          id?: never
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      universities: {
        Row: {
          country_id: string | null
          created_at: string
          id: number
          is_active: boolean
          name: string
        }
        Insert: {
          country_id?: string | null
          created_at?: string
          id?: never
          is_active?: boolean
          name: string
        }
        Update: {
          country_id?: string | null
          created_at?: string
          id?: never
          is_active?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "universities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      work_modalities: {
        Row: {
          code: string
          id: number
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          id?: never
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          id?: never
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_wizard_progress: {
        Args: { p_profile_id: string }
        Returns: {
          has_certifications: boolean
          has_education: boolean
          has_evidences: boolean
          has_experience: boolean
          has_languages: boolean
          has_preferences: boolean
          has_privacy_settings: boolean
          has_projects: boolean
          has_skills: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
