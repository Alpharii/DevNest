package projectdto

type ProjectDetailResponse struct {
	ID          uint   `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Visibility  uint   `json:"visibility"`
	IsJoined  	bool   `json:"isJoined"`

	Owner   ProjectOwnerResponse    `json:"owner"`
	Members []ProjectMemberResponse `json:"members"`
	BoardColumns []ProjectBoardColumnResponse `json:"board_columns"`
}

type ProjectOwnerResponse struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`

	Profile ProfileResponse `json:"profile"`
}

type ProjectMemberResponse struct {
	ID   uint   `json:"id"`
	Role string `json:"role"`

	User ProjectUserResponse `json:"user"`
}

type ProjectUserResponse struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`

	Profile ProfileResponse `json:"profile"`
}

type ProfileResponse struct {
	Bio       string   `json:"bio"`
	AvatarURL string   `json:"avatar_url"`
	Skills    []string `json:"skills"`
}

type ProjectBoardColumnResponse struct {
	ID    uint                  `json:"id"`
	Name  string                `json:"name"`
	Tasks []ProjectTaskResponse `json:"tasks"`
}

type ProjectTaskResponse struct {
	ID          uint                         `json:"id"`
	Title       string                       `json:"title"`
	Description string                       `json:"description"`
	Assignees   []ProjectTaskAssigneeResponse `json:"assignees"`
}

type ProjectTaskAssigneeResponse struct {
	ID       uint            `json:"id"`
	Username string          `json:"username"`
	Email    string          `json:"email"`
	Profile  ProfileResponse `json:"profile"`
}