package projectservices

import (
	"devNest/internal/entity"
	projectdto "devNest/internal/modules/project/dto"
)

func MapDetailProjectDTO(project entity.Project, userId uint) projectdto.ProjectDetailResponse {
	visibility := uint(0)
	if project.Visibility != nil {
		visibility = *project.Visibility
	}

	res := projectdto.ProjectDetailResponse{
		ID:          project.ID,
		Title:       project.Title,
		Description: project.Description,
		Visibility:  visibility,
		IsJoined:    false,
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

		// cek apakah user sudah join
		if m.User.ID == userId {
			res.IsJoined = true
		}

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

	for _, column := range project.BoardColumns {
		columnRes := projectdto.ProjectBoardColumnResponse{
			ID:   column.ID,
			Name: column.Name,
		}

		// tasks
		for _, task := range column.Tasks {
			taskRes := projectdto.ProjectTaskResponse{
				ID:          task.ID,
				Title:       task.Title,
				Description: task.Description,
			}

			// assignees
			for _, assignee := range task.Assignees {
				taskRes.Assignees = append(
					taskRes.Assignees,
					projectdto.ProjectTaskAssigneeResponse{
						ID:       assignee.User.ID,
						Username: assignee.User.Username,
						Email:    assignee.User.Email,
						Profile: projectdto.ProfileResponse{
							Bio:       assignee.User.Profile.Bio,
							AvatarURL: assignee.User.Profile.AvatarURL,
						},
					},
				)
			}
			columnRes.Tasks = append(columnRes.Tasks, taskRes)
		}
		res.BoardColumns = append(res.BoardColumns, columnRes)
	}

	return res
}