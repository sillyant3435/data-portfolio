export interface Project {
  id: number;
  title: string;
  metrics: string;
  abstract: string;
  imageUrl?: string;
}

export interface ProjectTelemetryData {
  projectName: string;
  datasetSizeRows: number;
  cleaningComplexity: number; // 1-10 scale
  algorithmUsed: string;
  processingTimeMs: number;
  skillsRadar: {
    sql: number; // 0-100 scale mapping to radar axis
    python: number;
    viz: number;
    stats: number;
    modeling: number;
    etl: number;
  };
}

export interface PersonalData {
  name: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  summary: string;
  projects: Project[];
  skillsRadar: {
    sql: number;
    python: number;
    viz: number;
    stats: number;
    modeling: number;
    etl: number;
  };
}

export const SOYAL_DATA: PersonalData = {
  name: "Soyal Dhital",
  role: "Data Analyst",
  email: "dhitalsoyal@gmail.com",
  phone: "+977 9865381544",
  address: "Bharatpur, Chitwan, Nepal",
  education: "BSc CSIT, Tribhuvan University (2025)",
  summary: "Detail-oriented BSc CSIT graduate with a strong foundation in data analysis, programming, and web development. Proficient in Python, SQL, and data visualization tools including Power BI and Pandas. Experienced in building data-driven solutions and interactive web applications.",
  projects: [
    { 
        id: 2, 
        title: "Sales Data Dashboard", 
        metrics: "Power BI / SQL", 
        abstract: "Cleaned and transformed raw sales datasets using Python to prepare structured data. Built an interactive Power BI dashboard with KPI cards and slicers for stakeholder reporting.", 
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800"
    },
    { 
        id: 3, 
        title: "Student Performance EDA", 
        metrics: "Python / Pandas", 
        abstract: "Performed exploratory data analysis (EDA) on a student performance dataset to identify key factors affecting academic outcomes using Matplotlib and Seaborn.", 
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800"
    }
  ],
  skillsRadar: {
    sql: 90,
    python: 85,
    viz: 95,
    stats: 80,
    modeling: 75,
    etl: 85
  }
};
