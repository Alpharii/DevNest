package projectdto

import "time"

type FindAllProjectPagination struct {
	Projects []AllProjects `json:"projects"`
	Page     int                     `json:"page"`
	Limit    int                     `json:"limit"`
	Total    int64                   `json:"total"`
}

type AllProjects struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	ImageUrl    string    `json:"image_url"`
	Visibility  uint      `json:"visibility"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Owner ProjectOwnerResponse `json:"owner"`

	MemberCount int `json:"member_count"`
}
