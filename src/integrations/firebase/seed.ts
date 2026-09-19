import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "./config";

export const DEMO_ACCOUNTS = [
  {
    id: "user-admin",
    email: "admin@school.com",
    name: "System Administrator",
    role: "admin" as const,
    password: "Admin123",
    duty: "Lead Systems Administrator & IT Director",
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    phone: "+250 788 567 890",
  },
  {
    id: "user-owner",
    email: "owner@school.com",
    name: "School Owner",
    role: "owner" as const,
    password: "Owner123",
    duty: "School Director & Proprietor",
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces",
    phone: "+250 788 678 901",
  },
  {
    id: "user-head-studies",
    email: "headofstudies@school.com",
    name: "Dr. Paul Kayitare",
    role: "head_of_studies" as const,
    password: "Studies123",
    duty: "Director of Academics & Head of Studies",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    phone: "+250 788 456 789",
  },
  {
    id: "user-secretary",
    email: "secretary@school.com",
    name: "Mary Uwase",
    role: "secretary" as const,
    password: "Secretary123",
    duty: "School Secretary & Front Desk Operations",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces",
    phone: "+250 788 234 567",
  },
  {
    id: "user-teacher",
    email: "teacher@school.com",
    name: "Jane Smith",
    role: "teacher" as const,
    password: "Teacher123",
    duty: "Senior Primary Teacher & Grade Head",
    photo_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=faces",
    phone: "+250 788 123 456",
  },
  {
    id: "user-finance",
    email: "finance@school.com",
    name: "Peter Habimana",
    role: "finance" as const,
    password: "Finance123",
    duty: "Chief Bursar & Finance Officer",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    phone: "+250 788 345 678",
  },
  {
    id: "user-parent",
    email: "parent@school.com",
    name: "John Doe Sr.",
    role: "parent" as const,
    password: "Parent123",
    duty: "Parent / Guardian",
    photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces",
    phone: "+250 788 901 234",
  },
];

export async function seedInitialData() {
  try {
    // Purge user-student profile/user if previously seeded
    try {
      await deleteDoc(doc(db, "profiles", "user-student"));
      await deleteDoc(doc(db, "users", "user-student"));
    } catch {
      // ignore
    }

    if (typeof window !== "undefined" && localStorage.getItem("schooltrack_seeded_v2")) {
      return;
    }

    // 1. Initial settings
    const settingsDoc = await getDoc(doc(db, "school_settings", "default"));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, "school_settings", "default"), {
        id: "default",
        school_name: "Little Gems Academy",
        email: "info@littlegemsacademy.edu",
        phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        notify_email: "notifications@littlegemsacademy.edu",
        logo_url: null,
      });
    }

    // 2. Demo Profiles & User Roles
    for (const acc of DEMO_ACCOUNTS) {
      const profRef = doc(db, "profiles", acc.id);
      const profSnap = await getDoc(profRef);
      const profData = {
        id: acc.id,
        full_name: acc.name,
        email: acc.email,
        phone: acc.phone || "+250 780 000 000",
        duty: acc.duty || "Staff Member",
        photo_url: acc.photo_url || null,
        active: true,
        created_at: new Date().toISOString(),
      };
      if (!profSnap.exists()) {
        await setDoc(profRef, profData);
      } else {
        await setDoc(profRef, profData, { merge: true });
      }

      const roleRef = doc(db, "user_roles", `role-${acc.id}`);
      const roleSnap = await getDoc(roleRef);
      if (!roleSnap.exists()) {
        await setDoc(roleRef, {
          id: `role-${acc.id}`,
          user_id: acc.id,
          role: acc.role,
        });
      }
    }

    // 3. Classes
    const defaultClasses = [
      { id: "class-p1", name: "Primary 1", teacher_id: "user-teacher" },
      { id: "class-p2", name: "Primary 2", teacher_id: "user-teacher" },
      { id: "class-p3", name: "Primary 3", teacher_id: null },
      { id: "class-p4", name: "Primary 4", teacher_id: "user-teacher" },
      { id: "class-p5", name: "Primary 5", teacher_id: null },
      { id: "class-p6", name: "Primary 6", teacher_id: null },
    ];

    for (const c of defaultClasses) {
      const classRef = doc(db, "classes", c.id);
      const snap = await getDoc(classRef);
      if (!snap.exists()) {
        await setDoc(classRef, {
          id: c.id,
          name: c.name,
          teacher_id: c.teacher_id,
          created_at: new Date().toISOString(),
        });
      }
    }

    // 4. Sample Students
    const sampleStudents = [
      {
        id: "std-0001",
        student_code: "STD-0001",
        full_name: "John Doe",
        gender: "male",
        date_of_birth: "2018-03-11",
        class_id: "class-p1",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=200&h=200&fit=crop&crop=faces",
        qr_token: "STU-STD-0001-QR",
        religion: "Christian",
        active: true,
      },
      {
        id: "std-p1-001",
        student_code: "STD-P1-001",
        full_name: "Kevine Uwase",
        gender: "female",
        date_of_birth: "2018-05-19",
        class_id: "class-p1",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&h=200&fit=crop&crop=faces",
        qr_token: "STU-STD-P1-001-QR",
        religion: "Christian",
        active: true,
      },
      {
        id: "std-0002",
        student_code: "STD-0002",
        full_name: "Alice Mukamana",
        gender: "female",
        date_of_birth: "2016-07-02",
        class_id: "class-p4",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: "https://images.unsplash.com/photo-1595454223600-91fbdd7ce51a?w=200&h=200&fit=crop&crop=faces",
        qr_token: "STU-STD-0002-QR",
        religion: "Christian",
        active: true,
      },
      {
        id: "std-0003",
        student_code: "STD-0003",
        full_name: "Eric Niyonzima",
        gender: "male",
        date_of_birth: "2018-01-25",
        class_id: "class-p2",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&crop=faces",
        qr_token: "STU-STD-0003-QR",
        religion: "Christian",
        active: true,
      },
      {
        id: "std-0004",
        student_code: "STD-0004",
        full_name: "Grace Ineza",
        gender: "female",
        date_of_birth: "2014-09-14",
        class_id: "class-p6",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=200&h=200&fit=crop&crop=faces",
        qr_token: "STU-STD-0004-QR",
        religion: "Christian",
        active: true,
      },
      {
        id: "std-0005",
        student_code: "STD-0005",
        full_name: "Jean Claude Mugisha",
        gender: "male",
        date_of_birth: "2014-04-12",
        class_id: "class-p6",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=200&h=200&fit=crop&crop=faces",
        qr_token: "STU-STD-0005-QR",
        religion: "Christian",
        active: true,
      },
      {
        id: "std-0006",
        student_code: "STD-0006",
        full_name: "Divine Uwamahoro",
        gender: "female",
        date_of_birth: "2014-11-20",
        class_id: "class-p6",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
        qr_token: "STU-STD-0006-QR",
        religion: "Christian",
        active: true,
      },
      {
        id: "std-0007",
        student_code: "STD-0007",
        full_name: "Cedric Habimana",
        gender: "male",
        date_of_birth: "2014-06-08",
        class_id: "class-p6",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: null,
        qr_token: "STU-STD-0007-QR",
        religion: "Christian",
        active: true,
      },
      {
        id: "std-0008",
        student_code: "STD-0008",
        full_name: "Kevin Shema",
        gender: "male",
        date_of_birth: "2015-05-15",
        class_id: "class-p5",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: null,
        qr_token: "STU-STD-0008-QR",
        religion: "Christian",
        active: true,
      },
      {
        id: "std-0009",
        student_code: "STD-0009",
        full_name: "Aline Uwera",
        gender: "female",
        date_of_birth: "2015-09-22",
        class_id: "class-p5",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: null,
        qr_token: "STU-STD-0009-QR",
        religion: "Christian",
        active: true,
      },
      {
        id: "std-0010",
        student_code: "STD-0010",
        full_name: "Patrick Mugabo",
        gender: "male",
        date_of_birth: "2015-12-03",
        class_id: "class-p5",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: null,
        qr_token: "STU-STD-0010-QR",
        religion: "Christian",
        active: true,
      },
      {
        id: "std-0011",
        student_code: "STD-0011",
        full_name: "Brian Mutabazi",
        gender: "male",
        date_of_birth: "2017-02-18",
        class_id: "class-p3",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: null,
        qr_token: "STU-STD-0011-QR",
        religion: "Christian",
        active: true,
      },
      {
        id: "std-0012",
        student_code: "STD-0012",
        full_name: "Chantal Mukashyaka",
        gender: "female",
        date_of_birth: "2017-08-30",
        class_id: "class-p3",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: null,
        qr_token: "STU-STD-0012-QR",
        religion: "Christian",
        academic_year: "2024-2025",
        active: true,
      },
      // Historical Records for Past Academic Years (for Secretary archives 2015-2030)
      {
        id: "std-hist-2024",
        student_code: "STD-2024-01",
        full_name: "Yvan Kayihura",
        gender: "male",
        date_of_birth: "2013-04-12",
        class_id: "class-p6",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: null,
        qr_token: "STU-HIST-2024-QR",
        religion: "Christian",
        academic_year: "2024-2025",
        active: true,
      },
      {
        id: "std-hist-2023",
        student_code: "STD-2023-01",
        full_name: "Nadege Umwali",
        gender: "female",
        date_of_birth: "2012-09-18",
        class_id: "class-p6",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: null,
        qr_token: "STU-HIST-2023-QR",
        religion: "Christian",
        academic_year: "2023-2024",
        active: true,
      },
      {
        id: "std-hist-2021",
        student_code: "STD-2021-02",
        full_name: "Fabrice Kwizera",
        gender: "male",
        date_of_birth: "2010-06-25",
        class_id: "class-p6",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: null,
        qr_token: "STU-HIST-2021-QR",
        religion: "Christian",
        academic_year: "2021-2022",
        active: true,
      },
      {
        id: "std-hist-2018",
        student_code: "STD-2018-05",
        full_name: "Sandrine Uwamariya",
        gender: "female",
        date_of_birth: "2007-11-14",
        class_id: "class-p6",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: null,
        qr_token: "STU-HIST-2018-QR",
        religion: "Christian",
        academic_year: "2018-2019",
        active: true,
      },
      {
        id: "std-hist-2015",
        student_code: "STD-2015-01",
        full_name: "Emmanuel Gasana",
        gender: "male",
        date_of_birth: "2004-03-08",
        class_id: "class-p6",
        parent_id: "user-parent",
        parent_name: "John Doe Sr.",
        parent_email: "parent@school.com",
        parent_phone: "+250 780 000 000",
        address: "Kigali, Rwanda",
        photo_url: null,
        qr_token: "STU-HIST-2015-QR",
        religion: "Christian",
        academic_year: "2015-2016",
        active: true,
      },
    ];

    for (const s of sampleStudents) {
      const sRef = doc(db, "students", s.id);
      const snap = await getDoc(sRef);
      if (!snap.exists()) {
        await setDoc(sRef, {
          ...s,
          created_at: new Date().toISOString(),
        });
      }
    }

    // 5. Sample Attendance for Today
    const todayStr = new Date().toISOString().slice(0, 10);
    const attSnap = await getDocs(collection(db, "attendance"));
    if (attSnap.empty) {
      const sampleAtt = [
        {
          id: `att-1`,
          student_id: "std-0001",
          class_id: "class-p4",
          attendance_date: todayStr,
          status: "present",
          arrival_time: "07:45",
          departure_time: null,
          recorded_by: "user-teacher",
          recorded_by_name: "Jane Smith",
          note: "On time, active participation",
          created_at: `${todayStr}T07:45:00.000Z`,
        },
        {
          id: `att-2`,
          student_id: "std-0002",
          class_id: "class-p4",
          attendance_date: todayStr,
          status: "late",
          arrival_time: "08:15",
          departure_time: null,
          recorded_by: "user-teacher",
          recorded_by_name: "Jane Smith",
          note: "Late due to rain",
          created_at: `${todayStr}T08:15:00.000Z`,
        },
        {
          id: `att-3`,
          student_id: "std-0003",
          class_id: "class-p2",
          attendance_date: todayStr,
          status: "present",
          arrival_time: "07:50",
          departure_time: null,
          recorded_by: "user-secretary",
          recorded_by_name: "Mary Uwase",
          note: "Scanned at main gate",
          created_at: `${todayStr}T07:50:00.000Z`,
        },
      ];

      for (const a of sampleAtt) {
        await setDoc(doc(db, "attendance", a.id), a);
      }
    }

    // 6. Announcements
    const annSnap = await getDocs(collection(db, "announcements"));
    if (annSnap.empty) {
      await setDoc(doc(db, "announcements", "ann-1"), {
        id: "ann-1",
        title: "Welcome to Little Gems Academy Term 2",
        body: "All classes have resumed. QR scanning stations are active at the front gate.",
        action_label: "View Timetable",
        action_url: "/timetable",
        image_url: null,
        created_by: "user-admin",
        created_at: new Date().toISOString(),
      });
    }

    // 7. Payments
    const paySnap = await getDocs(collection(db, "payments"));
    if (paySnap.empty) {
      await setDoc(doc(db, "payments", "pay-1"), {
        id: "pay-1",
        student_id: "std-0001",
        amount: 250,
        currency: "USD",
        category: "Tuition",
        method: "Bank Transfer",
        paid_on: todayStr,
        term: "Term 2",
        reference: "TXN-98412",
        status: "completed",
        description: "Term 2 Full Tuition payment",
        recorded_by: "user-finance",
        recorded_by_name: "Peter Habimana",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // 8. Assignments & Homework - disabled to only show user-created assignments
    if (false as boolean) {
      const sampleAssignments = [
        {
          id: "asg-1",
          teacher_id: "user-teacher",
          teacher_name: "Jane Smith",
          class_id: "class-p4",
          class_name: "Primary 4",
          title: "Fractions & Decimals Practice",
          subject: "Mathematics",
          type: "homework",
          description:
            "Complete textbook exercises 4A on page 42, numbers 1 through 8. Show all working clearly for fraction simplification.",
          due_date: "2026-09-10",
          total_points: 100,
          status: "approved",
          reviewed_by: "user-admin",
          reviewed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "asg-2",
          teacher_id: "user-teacher",
          teacher_name: "Jane Smith",
          class_id: "class-p4",
          class_name: "Primary 4",
          title: "Water Cycle Stages & Description",
          subject: "Science",
          type: "assignment",
          description:
            "Describe the three main stages of the water cycle (Evaporation, Condensation, Precipitation) and give one example of each in nature.",
          due_date: "2026-09-12",
          total_points: 50,
          status: "pending_approval",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "asg-3",
          teacher_id: "user-teacher",
          teacher_name: "Jane Smith",
          class_id: "class-p2",
          class_name: "Primary 2",
          title: "Vocabulary & Sentence Writing",
          subject: "English",
          type: "homework",
          description:
            "Write 5 complete sentences using our weekly vocabulary: School, Friend, Learn, Play, Book.",
          due_date: "2026-09-11",
          total_points: 100,
          status: "approved",
          reviewed_by: "user-admin",
          reviewed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      for (const a of sampleAssignments) {
        await setDoc(doc(db, "assignments", a.id), a);
      }

      // Initial auto-marked submission
      await setDoc(doc(db, "assignment_submissions", "sub-1"), {
        id: "sub-1",
        assignment_id: "asg-1",
        student_id: "std-0002",
        student_name: "Alice Mukamana",
        parent_id: "user-parent",
        class_id: "class-p4",
        answers: "Completed all 8 problems on fractions and decimals with simplified steps.",
        score: 100,
        max_score: 100,
        status: "graded",
        auto_feedback: "Submission verified and automatically marked with 100% full credit.",
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      // 9. Activities & Clubs Seed
      const sampleClubs = [
        {
          id: "club-football",
          name: "Football Team (School Eagles)",
          category: "Sports",
          description:
            "Official school football squad. Training focuses on footwork, match fitness, tactical set-pieces, and inter-school tournaments.",
          schedule: "Tuesdays & Thursdays, 3:45 PM - 5:15 PM",
          venue: "Main Sports Pitch",
          coach_name: "Coach David Kamanzi",
          coach_phone: "+250 788 123 456",
          capacity: 26,
          fee: "Included in Tuition",
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "club-volleyball",
          name: "Volleyball Club",
          category: "Sports",
          description:
            "Competitive and recreational volleyball for all grades. Training covers serving, setting, spiking, and friendly inter-house matches.",
          schedule: "Wednesdays & Fridays, 3:30 PM - 4:45 PM",
          venue: "Outdoor Sports Court",
          coach_name: "Coach Sarah Uwase",
          coach_phone: "+250 788 234 567",
          capacity: 20,
          fee: "Free",
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "club-robotics",
          name: "Robotics & STEM Club",
          category: "Academic & STEM",
          description:
            "Hands-on robotics kits, visual block programming, electronics sensors, and competition builds for regional STEM fairs.",
          schedule: "Mondays, 3:30 PM - 5:00 PM",
          venue: "Science & Innovation Lab",
          coach_name: "Mr. Eric Mugabo",
          coach_phone: "+250 788 345 678",
          capacity: 18,
          fee: "KSh 1,000 / Term",
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "club-drama",
          name: "Drama & Theater Society",
          category: "Arts & Culture",
          description:
            "Stage acting, voice projection, creative improvisation, costume design, and annual school musical drama production.",
          schedule: "Tuesdays & Fridays, 3:30 PM - 5:00 PM",
          venue: "School Auditorium",
          coach_name: "Mrs. Grace Mukamana",
          coach_phone: "+250 788 456 789",
          capacity: 25,
          fee: "Free",
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "club-chess",
          name: "Chess & Strategy Club",
          category: "Academic & STEM",
          description:
            "Critical thinking, opening theory, tactical puzzles, tournament etiquette, and blitz championship games.",
          schedule: "Wednesdays, 3:30 PM - 4:45 PM",
          venue: "Library Resource Room",
          coach_name: "Mr. John Bizimana",
          coach_phone: "+250 788 567 890",
          capacity: 24,
          fee: "Free",
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "club-music",
          name: "Music Band & Choir",
          category: "Music & Performing",
          description:
            "Ensemble vocals, acoustic guitar, brass instruments, and choral performances at national celebrations and school assemblies.",
          schedule: "Thursdays, 3:30 PM - 5:00 PM",
          venue: "Music Studio",
          coach_name: "Ms. Aline Ingabire",
          coach_phone: "+250 788 678 901",
          capacity: 30,
          fee: "Free",
          status: "active",
          created_at: new Date().toISOString(),
        },
      ];

      for (const club of sampleClubs) {
        await setDoc(doc(db, "clubs", club.id), club);
      }

      // Initial club memberships
      const sampleMemberships = [
        {
          id: "mem-1",
          club_id: "club-football",
          student_id: "std-0005",
          student_name: "Jean Claude Mugisha",
          student_code: "STD-0005",
          class_name: "Primary 6",
          parent_id: "user-parent",
          parent_name: "John Doe Sr.",
          role_in_club: "Team Captain",
          notes: "Primary 6 varsity striker, jersey #10",
          enrolled_at: new Date().toISOString(),
          enrolled_by_name: "Coach David Kamanzi",
          enrolled_by_role: "teacher",
        },
        {
          id: "mem-2",
          club_id: "club-football",
          student_id: "std-0007",
          student_name: "Cedric Habimana",
          student_code: "STD-0007",
          class_name: "Primary 6",
          parent_id: "user-parent",
          parent_name: "John Doe Sr.",
          role_in_club: "Goalkeeper",
          notes: "First choice goalkeeper, jersey #1",
          enrolled_at: new Date().toISOString(),
          enrolled_by_name: "Coach David Kamanzi",
          enrolled_by_role: "teacher",
        },
        {
          id: "mem-3",
          club_id: "club-volleyball",
          student_id: "std-0006",
          student_name: "Divine Uwamahoro",
          student_code: "STD-0006",
          class_name: "Primary 6",
          parent_id: "user-parent",
          parent_name: "John Doe Sr.",
          role_in_club: "Setter",
          notes: "Starting setter and team coordinator",
          enrolled_at: new Date().toISOString(),
          enrolled_by_name: "Coach Sarah Uwase",
          enrolled_by_role: "teacher",
        },
        {
          id: "mem-4",
          club_id: "club-robotics",
          student_id: "std-0002",
          student_name: "Alice Mukamana",
          student_code: "STD-0002",
          class_name: "Primary 4",
          parent_id: "user-parent",
          parent_name: "John Doe Sr.",
          role_in_club: "Lead Programmer",
          notes: "Science fair project coordinator",
          enrolled_at: new Date().toISOString(),
          enrolled_by_name: "Mr. Eric Mugabo",
          enrolled_by_role: "teacher",
        },
        {
          id: "mem-5",
          club_id: "club-chess",
          student_id: "std-0008",
          student_name: "Kevin Shema",
          student_code: "STD-0008",
          class_name: "Primary 5",
          parent_id: "user-parent",
          parent_name: "John Doe Sr.",
          role_in_club: "Member",
          notes: "Junior inter-school chess ladder player",
          enrolled_at: new Date().toISOString(),
          enrolled_by_name: "Mr. John Bizimana",
          enrolled_by_role: "teacher",
        },
      ];

      for (const m of sampleMemberships) {
        await setDoc(doc(db, "club_memberships", m.id), m);
      }

      // Sample Assignments & Submissions - disabled to only show user-created assignments
      if (false as boolean) {
        const sampleAssignments = [
          {
            id: "asg-math-p4",
            teacher_id: "user-teacher",
            teacher_name: "Jane Smith",
            class_id: "class-p4",
            class_name: "Primary 4",
            title: "Primary 4 Mathematics - Fractions & Mixed Numbers Practice",
            subject: "Mathematics",
            questions:
              "1. Simplify the fraction 18/24 to its lowest terms.\n2. Calculate 3/5 + 7/10 and write your answer as a mixed number.\n3. A baker has 12 kg of flour and uses 3/4 of it for bread. How many kilograms remain?",
            description: "Show your working clearly for full marks.",
            target_student_ids: ["all"],
            due_date: "2026-09-25",
            total_points: 100,
            status: "active",
            created_at: new Date().toISOString(),
          },
          {
            id: "asg-sci-p6",
            teacher_id: "user-teacher",
            teacher_name: "Jane Smith",
            class_id: "class-p6",
            class_name: "Primary 6",
            title: "Primary 6 Science - Photosynthesis and Plant Energy",
            subject: "Science & Tech",
            questions:
              "1. State the three essential requirements for photosynthesis to take place.\n2. Write down the word equation for photosynthesis.\n3. Explain why leaves appear green under natural light.",
            description: "Answer each question in clear sentences.",
            target_student_ids: ["std-0004", "std-0005", "std-0006"],
            due_date: "2026-09-28",
            total_points: 100,
            status: "active",
            created_at: new Date().toISOString(),
          },
        ];

        for (const a of sampleAssignments) {
          await setDoc(doc(db, "assignments", a.id), a);
        }

        const sampleSubmissions = [
          {
            id: "sub-math-p4-std-0001",
            assignment_id: "asg-math-p4",
            student_id: "std-0001",
            student_name: "John Doe",
            parent_id: "user-parent",
            class_id: "class-p4",
            answers:
              "1. 18/24 divided by 6/6 = 3/4\n2. 3/5 + 7/10 = 6/10 + 7/10 = 13/10 = 1 and 3/10\n3. 12 * (3/4) = 9 kg used. Remaining: 12 - 9 = 3 kg.",
            status: "graded",
            score: 95,
            max_score: 100,
            teacher_feedback:
              "Excellent reasoning and clear calculation steps! Outstanding effort.",
            submitted_at: new Date().toISOString(),
            marked_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
          {
            id: "sub-math-p4-std-0002",
            assignment_id: "asg-math-p4",
            student_id: "std-0002",
            student_name: "Alice Mukamana",
            parent_id: "user-parent",
            class_id: "class-p4",
            answers: "1. 3/4\n2. 6/10 + 7/10 = 13/10 (1 3/10)\n3. 3 kg left after baking bread.",
            status: "submitted",
            score: null,
            max_score: 100,
            teacher_feedback: null,
            submitted_at: new Date().toISOString(),
            marked_at: null,
            created_at: new Date().toISOString(),
          },
        ];

        for (const sub of sampleSubmissions) {
          await setDoc(doc(db, "assignment_submissions", sub.id), sub);
        }
      }

      // Sample Staff Salaries
      const sampleSalaries = [
        {
          id: "sal-teacher-2026-09",
          staff_id: "user-teacher",
          staff_name: "Jane Smith",
          staff_email: "teacher@school.com",
          staff_duty: "Senior Primary Teacher & Grade Head",
          staff_role: "teacher",
          staff_phone: "+250 788 123 456",
          staff_photo_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=faces",
          month_year: "2026-09",
          base_amount: 450000,
          allowances: 50000,
          deductions: 30000,
          net_amount: 470000,
          currency: "RWF",
          payment_method: "bank",
          payment_date: "2026-09-15",
          reference: "BK-PAY-202609-01",
          notes: "September 2026 salary disbursement via Bank of Kigali direct deposit",
          status: "paid",
          paid_by: "user-finance",
          paid_by_name: "Peter Habimana",
          created_at: new Date().toISOString(),
        },
        {
          id: "sal-teacher-2026-08",
          staff_id: "user-teacher",
          staff_name: "Jane Smith",
          staff_email: "teacher@school.com",
          staff_duty: "Senior Primary Teacher & Grade Head",
          staff_role: "teacher",
          staff_phone: "+250 788 123 456",
          staff_photo_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=faces",
          month_year: "2026-08",
          base_amount: 450000,
          allowances: 50000,
          deductions: 30000,
          net_amount: 470000,
          currency: "RWF",
          payment_method: "bank",
          payment_date: "2026-08-28",
          reference: "BK-PAY-202608-01",
          notes: "August 2026 salary disbursement",
          status: "paid",
          paid_by: "user-finance",
          paid_by_name: "Peter Habimana",
          created_at: new Date().toISOString(),
        },
        {
          id: "sal-sec-2026-09",
          staff_id: "user-secretary",
          staff_name: "Mary Uwase",
          staff_email: "secretary@school.com",
          staff_duty: "School Secretary & Front Desk Operations",
          staff_role: "secretary",
          staff_phone: "+250 788 234 567",
          staff_photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces",
          month_year: "2026-09",
          base_amount: 350000,
          allowances: 35000,
          deductions: 25000,
          net_amount: 360000,
          currency: "RWF",
          payment_method: "mobile money",
          payment_date: "2026-09-15",
          reference: "MOMO-LGA-9281",
          notes: "September 2026 secretarial salary paid via MTN MoMo",
          status: "paid",
          paid_by: "user-finance",
          paid_by_name: "Peter Habimana",
          created_at: new Date().toISOString(),
        },
        {
          id: "sal-head-2026-09",
          staff_id: "user-head-studies",
          staff_name: "Dr. Paul Kayitare",
          staff_email: "headofstudies@school.com",
          staff_duty: "Director of Academics & Head of Studies",
          staff_role: "head_of_studies",
          staff_phone: "+250 788 456 789",
          staff_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
          month_year: "2026-09",
          base_amount: 650000,
          allowances: 70000,
          deductions: 50000,
          net_amount: 670000,
          currency: "RWF",
          payment_method: "bank",
          payment_date: "2026-09-15",
          reference: "BK-PAY-202609-03",
          notes: "September 2026 Academic Director remuneration",
          status: "paid",
          paid_by: "user-finance",
          paid_by_name: "Peter Habimana",
          created_at: new Date().toISOString(),
        },
      ];

      for (const sal of sampleSalaries) {
        const salRef = doc(db, "salaries", sal.id);
        const snap = await getDoc(salRef);
        if (!snap.exists()) {
          await setDoc(salRef, sal);
        }
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("schooltrack_seeded_v2", "true");
    }
  } catch (err) {
    console.warn("Auto-seeding encountered non-fatal error:", err);
  }
}
