package projectdto

type ProjectDetailResponse struct {
	ID          uint   `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Visibility  uint   `json:"visibility"`

	Owner   ProjectOwnerResponse    `json:"owner"`
	Members []ProjectMemberResponse `json:"members"`
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