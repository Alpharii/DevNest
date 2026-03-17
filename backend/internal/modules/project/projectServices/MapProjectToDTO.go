package projectservices

import (
	"devNest/internal/entity"
	projectdto "devNest/internal/modules/project/dto"
)


func MapProjectToDTO(project entity.Project) projectdto.ProjectDetailResponse {
	visibility := uint(0)
	if project.Visibility != nil {
		visibility = *project.Visibility
	}

	res := projectdto.ProjectDetailResponse{
		ID:          project.ID,
		Title:       project.Title,
		Description: project.Description,
		Visibility:  visibility,
	}

	// owner
	res.Owner = projectdto.ProjectOwnerResponse{
		ID:       project.Owner.ID,
		Username: project.Owner.Username,
		Email:    project.Owner.Email,
		Profile: projectdto.ProfileResponse{
			Bio:       project.Owner.Profile.Bio,
			AvatarURL: project.Owner.Profile.AvatarURL,
		},
	}

	// members
	for _, m := range project.Members {
		member := projectdto.ProjectMemberResponse{
			ID:   m.ID,
			Role: m.Role,
			User: projectdto.ProjectUserResponse{
				ID:       m.User.ID,
				Username: m.User.Username,
				Email:    m.User.Email,
				Profile: projectdto.ProfileResponse{
					Bio:       m.User.Profile.Bio,
					AvatarURL: m.User.Profile.AvatarURL,
				},
			},
		}

		res.Members = append(res.Members, member)
	}

	return res
}