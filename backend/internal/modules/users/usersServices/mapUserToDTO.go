package usersservices

import (
	"devNest/internal/entity"
	usersdto "devNest/internal/modules/users/dto"
)
func MapDashboardToDTO(user entity.User) usersdto.DashboardResponse {
	res := usersdto.DashboardResponse{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
		Profile: usersdto.ProfileResponse{
			Bio:       user.Profile.Bio,
			AvatarURL: user.Profile.AvatarURL,
		},

		OwnedProjects:  []usersdto.ProjectResponse{},
		MemberProjects: []usersdto.MemberProjectResponse{},
		AssignedTasks:  []usersdto.TaskAssigneeResponse{},
	}

	for _, p := range user.OwnedProjects {
		res.OwnedProjects = append(res.OwnedProjects, usersdto.ProjectResponse{
			ID:          p.ID,
			Title:       p.Title,
			Description: p.Description,
		})
	}

	for _, mp := range user.MemberProjects {
		res.MemberProjects = append(res.MemberProjects, usersdto.MemberProjectResponse{
			ID:   mp.ID,
			Role: mp.Role,
			Project: usersdto.ProjectResponse{
				ID:          mp.Project.ID,
				Title:       mp.Project.Title,
				Description: mp.Project.Description,
			},
		})
	}

	for _, t := range user.AssignedTasks {
		res.AssignedTasks = append(res.AssignedTasks, usersdto.TaskAssigneeResponse{
			ID: t.ID,
			Tasks: usersdto.TasksResponse{
				ID:          t.Task.ID,
				Title:       t.Task.Title,
				Description: t.Task.Description,
			},
		})
	}

	return res
}