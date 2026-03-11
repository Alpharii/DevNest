package entity

import "gorm.io/gorm"

type Project struct {
	gorm.Model
	ID          uint   			`gorm:"primaryKey"`
	Title       string 			`gorm:"size:255;not null"`
	Description string 			`gorm:"type:text"`
	OwnerID 	uint
	Owner   	User 			`gorm:"foreignKey:OwnerID"`
	Visibility *uint 			`gorm:"default:1;not null"`
	Members 	[]ProjectMember `gorm:"foreignKey:ProjectID"`
}