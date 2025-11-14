export const Permissions = {
  pages: {
    dashboard: ["admin", "helpdesk", "user"],
    tickets: ["admin", "helpdesk", "user"],
  },
  components: {
    assignSection: ["admin"],
    feedbackSection: ["user"],
    navigation: ["admin", "helpdesk"],
    info: ["admin", "helpdesk", "user"],
    agentNote: ["admin", "helpdesk"],
    feedback: ["user"],
    comment: ["admin", "helpdesk", "user"],
    completeTicket: ["admin", "helpdesk"],
    transferTicket: ["admin", "helpdesk"],
    rejectTicket: ["admin"],
  },
  menu: {
    dashboard: ["admin", "helpdesk", "user"],
    tickets: ["admin", "helpdesk", "user"],
    departments: ["admin"],
    reports: ["admin"],
    settings: ["admin"],
    faq: ["admin", "user", "helpdesk"],
  },
  ticketDetail: {
    navigation: ["admin"],
    info: ["admin", "helpdesk", "user"],
    updateSection: ["admin"],         // Tiếp nhận & phân loại
    agentNote: ["admin", "helpdesk"],
    feedback: ["user"],                          // Chỉ user được feedback
    comment: ["admin", "helpdesk", "user"],
  },
};
