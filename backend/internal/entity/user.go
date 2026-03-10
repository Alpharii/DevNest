package entity

import "gorm.io/gorm"

type User struct {
	gorm.Model

	ID       uint   `gorm:"primaryKey"`
	Username string `gorm:"size:100;not null"`
	Email    string `gorm:"size:100;uniqueIndex;not null"`
	Password string `gorm:"size:255;not null" json:"-"`

	Profile  Profile `gorm:"constraint:OnDelete:CASCADE;"`

	OwnedProjects []Project       `gorm:"foreignKey:OwnerID"`
	MemberProjects []ProjectMember `gorm:"foreignKey:UserID"`
}