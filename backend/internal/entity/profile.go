package entity

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Profile struct {
	gorm.Model
	UserID uint `gorm:"uniqueIndex"`

	Bio              string `gorm:"type:text"`
	AvatarURL        string
	Location         string
	Website          string
	GithubURL        string
	LinkedinURL      string
	TwitterURL       string
	ExperienceLevel  string // junior, mid, senior
	Availability     string // open, busy, hiring

	Skills datatypes.JSON `gorm:"type:jsonb"`
}