export const API_URL = 'https://localhost:7201/';

export const endpoints = {
    account: {
        login: 'api/Authentication/login',
        register: 'api/Authentication/register',
        verifyOTP: 'api/Authentication/verify-otp',
        sendOTP: 'api/Email/send'
    },
    manageAccount: {
        getAccount: 'api/Account/list-account-with-role-gender-status',

        // create Account for Lecturer
        createAccount: 'api/Account/create-account',
    },
    manageClass: {
        create: 'api/Class/create',
        getAll: 'api/Class/get-all-paginated',
        getById: 'api/Class/get-by-id',
        getbySubject: '/api/Class/get-by-subject',
        update: 'api/Class/update',
        getByTeacher: 'api/Class/get-by-teacher',
        getByStudent: 'api/Class/get-by-subject-teacher',
        getByStatus: 'api/Class/get-by-status',
        delete: 'api/Class/delete/',
        count: 'api/Subject/count'
    },
    manageBlog: {
        
    },
    manageSchedule: {
        
    },
    manageSubject:{
        create: 'api/Subject/create',
        getAll: 'api/Subject/get-all',
        update: 'api/Subject/update',
        getById: 'api/Subject/get-subject-by-',
        delete: 'api/Subject/delete/',
        count: 'api/Subject/count'
    },
    syllabus: {
        // Assessment Criteria
        getAssessmentCriteria: 'api/AssessmentCriteria/get-by-syllabus',
        createAssessmentCriteria: 'api/AssessmentCriteria/create',
        updateAssessmentCriteria: 'api/AssessmentCriteria/update',
        deleteAssessmentCriteria: 'api/AssessmentCriteria/delete',

        // Syllabus Info
        getSyllabusInfo: 'api/Syllabus/get-syllabus-by-subject-id',
        create: 'api/Syllabus/create-syllabus',
        update: 'api/Syllabus/update-syllabus',
        delete: 'api/Syllabus/delete-syllabus',
        
        // Syllabus Schedule
        getSchedule: 'api/Syllabus/get-schedule',
        addSchedule: 'api/Syllabus/add-schedule',
        updateSchedule: 'api/Syllabus/update-schedule',
        deleteSchedule: 'api/Syllabus/delete-schedule'
    },
};