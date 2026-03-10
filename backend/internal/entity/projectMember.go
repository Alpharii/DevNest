package entity

import "gorm.io/gorm"

type ProjectMember struct {
	gorm.Model

	ID        uint `gorm:"primaryKey"`

	ProjectID uint
	Project   Project `gorm:"foreignKey:ProjectID"`

	UserID uint
	User   User `gorm:"foreignKey:UserID"`

	Role string `gorm:"type:varchar(20);default:'dev'"`
}