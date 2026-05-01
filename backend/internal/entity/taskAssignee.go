package entity

import "gorm.io/gorm"

type TaskAssignee struct {
	gorm.Model

	TaskID uint
	Task   Task `gorm:"foreignKey:TaskID"`

	UserID uint
	User   User `gorm:"foreignKey:UserID"`
}