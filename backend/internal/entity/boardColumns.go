package entity

import "gorm.io/gorm"

type BoardColumn struct {
	gorm.Model

	ID        	uint   `gorm:"primaryKey"`
	Name      	string `gorm:"size:255;not null"`
	ProjectID 	uint
	Project   	Project `gorm:"foreignKey:ProjectID"`

	Tasks		[]Task `gorm:"foreignKey:BoardColumnID"`
}