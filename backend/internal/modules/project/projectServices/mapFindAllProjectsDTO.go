package projectservices

import (
	"devNest/internal/entity"
	projectdto "devNest/internal/modules/project/dto"
)

func MapFindAllProjectsDTO(
	projects []entity.Project,
	page int,
	limit int,
	total int64,
) projectdto.FindAllProjectPagination {

	var projectResponses []projectdto.AllProjects

	for _, project := range projects {

		var visibility uint

		if project.Visibility != nil {
			visibility = *project.Visibility
		}

		projectResponses = append(projectResponses, projectdto.AllProjects{
			ID:          project.ID,
			Title:       project.Title,
			Description: project.Description,
			ImageUrl:    project.ImageUrl,
			Visibility:  visibility,

			CreatedAt: project.CreatedAt,
			UpdatedAt: project.UpdatedAt,

			Owner: projectdto.ProjectOwnerResponse{
				ID:       project.Owner.ID,
				Username: project.Owner.Username,
				Email:    project.Owner.Email,

				Profile: projectdto.ProfileResponse{
					Bio:       project.Owner.Profile.Bio,
					AvatarURL: project.Owner.Profile.AvatarURL,
				},
			},

			MemberCount: len(project.Members),
		})
	}

	return projectdto.FindAllProjectPagination{
		Projects: projectResponses,
		Page:     page,
		Limit:    limit,
		Total:    total,
	}
}