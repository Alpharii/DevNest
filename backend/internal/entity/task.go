package entity

import "gorm.io/gorm"

type Task struct {
	gorm.Model

	Title       string `gorm:"size:255;not null"`
	Description string `gorm:"type:text"`

	BoardColumnID uint
	BoardColumn   BoardColumn `gorm:"foreignKey:BoardColumnID"`

	Assignees []TaskAssignee `gorm:"foreignKey:TaskID"`
}