package usersdto

type DashboardResponse struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`

	Profile ProfileResponse `json:"profile"`

	OwnedProjects  []ProjectResponse       `json:"owned_projects"`
	MemberProjects []MemberProjectResponse `json:"member_projects"`
	AssignedTasks  []TaskAssigneeResponse  `json:"assigned_tasks"`
}

type ProfileResponse struct {
	Bio       string `json:"bio"`
	AvatarURL string `json:"avatar_url"`
}

type ProjectResponse struct {
	ID          uint   `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type MemberProjectResponse struct {
	ID      uint            `json:"id"`
	Role    string          `json:"role"`
	Project ProjectResponse `json:"project"`
}

type TasksResponse struct {
	ID          uint   `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type TaskAssigneeResponse struct {
	ID      uint            `json:"id"`
	Tasks 	TasksResponse   `json:"project"`
}


