export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      announcements: {
        Row: {
          action_label: string | null;
          action_url: string | null;
          body: string;
          created_at: string;
          created_by: string | null;
          id: string;
          image_url: string | null;
          title: string;
        };
        Insert: {
          action_label?: string | null;
          action_url?: string | null;
          body: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          image_url?: string | null;
          title: string;
        };
        Update: {
          action_label?: string | null;
          action_url?: string | null;
          body?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          image_url?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      assignments: {
        Row: {
          id: string;
          teacher_id: string;
          teacher_name: string | null;
          class_id: string;
          class_name: string | null;
          title: string;
          subject: string;
          type: string;
          description: string | null;
          due_date: string | null;
          total_points: number | null;
          status: "pending_approval" | "approved" | "rejected";
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          teacher_name?: string | null;
          class_id: string;
          class_name?: string | null;
          title: string;
          subject: string;
          type?: string;
          description?: string | null;
          due_date?: string | null;
          total_points?: number | null;
          status?: "pending_approval" | "approved" | "rejected";
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          teacher_name?: string | null;
          class_id?: string;
          class_name?: string | null;
          title?: string;
          subject?: string;
          type?: string;
          description?: string | null;
          due_date?: string | null;
          total_points?: number | null;
          status?: "pending_approval" | "approved" | "rejected";
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assignments_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
        ];
      };
      assignment_submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          student_name: string | null;
          parent_id: string | null;
          class_id: string | null;
          answers: string | null;
          score: number | null;
          max_score: number | null;
          status: string;
          auto_feedback: string | null;
          submitted_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          student_id: string;
          student_name?: string | null;
          parent_id?: string | null;
          class_id?: string | null;
          answers?: string | null;
          score?: number | null;
          max_score?: number | null;
          status?: string;
          auto_feedback?: string | null;
          submitted_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          student_id?: string;
          student_name?: string | null;
          parent_id?: string | null;
          class_id?: string | null;
          answers?: string | null;
          score?: number | null;
          max_score?: number | null;
          status?: string;
          auto_feedback?: string | null;
          submitted_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey";
            columns: ["assignment_id"];
            isOneToOne: false;
            referencedRelation: "assignments";
            referencedColumns: ["id"];
          },
        ];
      };
      attendance: {
        Row: {
          arrival_time: string | null;
          attendance_date: string;
          class_id: string | null;
          created_at: string;
          departure_time: string | null;
          id: string;
          note: string | null;
          recorded_by: string | null;
          recorded_by_name: string | null;
          status: Database["public"]["Enums"]["attendance_status"];
          student_id: string;
        };
        Insert: {
          arrival_time?: string | null;
          attendance_date?: string;
          class_id?: string | null;
          created_at?: string;
          departure_time?: string | null;
          id?: string;
          note?: string | null;
          recorded_by?: string | null;
          recorded_by_name?: string | null;
          status: Database["public"]["Enums"]["attendance_status"];
          student_id: string;
        };
        Update: {
          arrival_time?: string | null;
          attendance_date?: string;
          class_id?: string | null;
          created_at?: string;
          departure_time?: string | null;
          id?: string;
          note?: string | null;
          recorded_by?: string | null;
          recorded_by_name?: string | null;
          status?: Database["public"]["Enums"]["attendance_status"];
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendance_recorded_by_fkey";
            columns: ["recorded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendance_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          created_at: string;
          details: Json;
          entity: string | null;
          id: string;
          user_id: string | null;
          user_name: string | null;
        };
        Insert: {
          action: string;
          created_at?: string;
          details?: Json;
          entity?: string | null;
          id?: string;
          user_id?: string | null;
          user_name?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string;
          details?: Json;
          entity?: string | null;
          id?: string;
          user_id?: string | null;
          user_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      classes: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          teacher_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          teacher_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          teacher_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          body: string;
          created_at: string;
          error: string | null;
          id: string;
          parent_id: string | null;
          recipient_email: string;
          status: string;
          student_id: string | null;
          subject: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          error?: string | null;
          id?: string;
          parent_id?: string | null;
          recipient_email: string;
          status?: string;
          student_id?: string | null;
          subject: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          error?: string | null;
          id?: string;
          parent_id?: string | null;
          recipient_email?: string;
          status?: string;
          student_id?: string | null;
          subject?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          category: string;
          created_at: string;
          currency: string;
          description: string;
          id: string;
          method: string;
          paid_on: string;
          recorded_by: string | null;
          recorded_by_name: string | null;
          reference: string | null;
          status: string;
          student_id: string;
          term: string;
          updated_at: string;
        };
        Insert: {
          amount?: number;
          category?: string;
          created_at?: string;
          currency?: string;
          description?: string;
          id?: string;
          method?: string;
          paid_on?: string;
          recorded_by?: string | null;
          recorded_by_name?: string | null;
          reference?: string | null;
          status?: string;
          student_id: string;
          term?: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          category?: string;
          created_at?: string;
          currency?: string;
          description?: string;
          id?: string;
          method?: string;
          paid_on?: string;
          recorded_by?: string | null;
          recorded_by_name?: string | null;
          reference?: string | null;
          status?: string;
          student_id?: string;
          term?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_recorded_by_fkey";
            columns: ["recorded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      permission_requests: {
        Row: {
          class_id: string | null;
          created_at: string;
          decision_note: string | null;
          id: string;
          reason: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          reviewed_by_name: string | null;
          status: string;
          teacher_id: string;
          teacher_name: string | null;
          updated_at: string;
        };
        Insert: {
          class_id?: string | null;
          created_at?: string;
          decision_note?: string | null;
          id?: string;
          reason?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          reviewed_by_name?: string | null;
          status?: string;
          teacher_id: string;
          teacher_name?: string | null;
          updated_at?: string;
        };
        Update: {
          class_id?: string | null;
          created_at?: string;
          decision_note?: string | null;
          id?: string;
          reason?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          reviewed_by_name?: string | null;
          status?: string;
          teacher_id?: string;
          teacher_name?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "permission_requests_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "permission_requests_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "permission_requests_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          active: boolean;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          phone: string | null;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          email?: string;
          full_name?: string;
          id: string;
          phone?: string | null;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          phone?: string | null;
        };
        Relationships: [];
      };
      school_settings: {
        Row: {
          address: string;
          email: string;
          id: boolean;
          logo_url: string | null;
          notify_email: string;
          phone: string;
          school_name: string;
        };
        Insert: {
          address?: string;
          email?: string;
          id?: boolean;
          logo_url?: string | null;
          notify_email?: string;
          phone?: string;
          school_name?: string;
        };
        Update: {
          address?: string;
          email?: string;
          id?: boolean;
          logo_url?: string | null;
          notify_email?: string;
          phone?: string;
          school_name?: string;
        };
        Relationships: [];
      };
      staff_attendance: {
        Row: {
          arrival_time: string | null;
          attendance_date: string;
          created_at: string;
          departure_time: string | null;
          id: string;
          note: string | null;
          recorded_by: string | null;
          recorded_by_name: string | null;
          staff_id: string;
          staff_name: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          arrival_time?: string | null;
          attendance_date?: string;
          created_at?: string;
          departure_time?: string | null;
          id?: string;
          note?: string | null;
          recorded_by?: string | null;
          recorded_by_name?: string | null;
          staff_id: string;
          staff_name?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          arrival_time?: string | null;
          attendance_date?: string;
          created_at?: string;
          departure_time?: string | null;
          id?: string;
          note?: string | null;
          recorded_by?: string | null;
          recorded_by_name?: string | null;
          staff_id?: string;
          staff_name?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "staff_attendance_recorded_by_fkey";
            columns: ["recorded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "staff_attendance_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      students: {
        Row: {
          active: boolean;
          address: string | null;
          class_id: string | null;
          created_at: string;
          date_of_birth: string | null;
          full_name: string;
          gender: string;
          id: string;
          parent_email: string | null;
          parent_id: string | null;
          parent_name: string | null;
          parent_phone: string | null;
          photo_url: string | null;
          qr_token: string;
          religion: string;
          student_code: string;
        };
        Insert: {
          active?: boolean;
          address?: string | null;
          class_id?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          full_name: string;
          gender?: string;
          id?: string;
          parent_email?: string | null;
          parent_id?: string | null;
          parent_name?: string | null;
          parent_phone?: string | null;
          photo_url?: string | null;
          qr_token?: string;
          religion?: string;
          student_code: string;
        };
        Update: {
          active?: boolean;
          address?: string | null;
          class_id?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          full_name?: string;
          gender?: string;
          id?: string;
          parent_email?: string | null;
          parent_id?: string | null;
          parent_name?: string | null;
          parent_phone?: string | null;
          photo_url?: string | null;
          qr_token?: string;
          religion?: string;
          student_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "students_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      timetable: {
        Row: {
          class_id: string | null;
          created_at: string;
          day_of_week: number;
          end_time: string;
          id: string;
          room: string | null;
          start_time: string;
          subject: string;
          teacher_id: string | null;
          updated_at: string;
        };
        Insert: {
          class_id?: string | null;
          created_at?: string;
          day_of_week?: number;
          end_time?: string;
          id?: string;
          room?: string | null;
          start_time?: string;
          subject: string;
          teacher_id?: string | null;
          updated_at?: string;
        };
        Update: {
          class_id?: string | null;
          created_at?: string;
          day_of_week?: number;
          end_time?: string;
          id?: string;
          room?: string | null;
          start_time?: string;
          subject?: string;
          teacher_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "timetable_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "timetable_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "secretary" | "teacher" | "parent" | "finance" | "owner";
      attendance_status: "present" | "absent" | "sick" | "late";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "secretary", "teacher", "parent", "finance", "owner"],
      attendance_status: ["present", "absent", "sick", "late"],
    },
  },
} as const;
