export default function validations() {
    const validate = (formData, errors) => {
        if (!formData.FirstName.trim()) {
            errors.FirstNameError = "First Name Can't be Blank *"
        }
        else if (formData.FirstName.length < 3) {
            errors.FirstNameError = "First Name must contain atleast 3 characters !"
        }
        else if (formData.FirstName.length > 20) {
            errors.FirstNameError = "First Name must contain atmost 20 characters !"
        }
        else {
            errors.FirstNameError = ""
        }

        if (!formData.LastName.trim()) {
            errors.LastNameError = "Last Name Can't be Blank *"
        }
        else if (formData.LastName.length < 3) {
            errors.LastNameError = "Last Name must contain atleast 3 characters !"
        }
        else if (formData.LastName.length > 20) {
            errors.LastNameError = "Last Name must contain atmost 20 characters !"
        }
        else {
            errors.LastNameError = ""
        }

        !formData.DateOfBirth ? errors.DOBError = "Please Select Date of Birth*" : errors.DOBError = ""
        !formData.Gender ? errors.GenderError = "Please select Gender*" : errors.GenderError = ""

        if (!formData.Age) {
            errors.AgeError = "Age Required *"
        }
        else if (formData.Age < 18 || formData.Age > 100) {
            errors.AgeError = "Not Eligible"
        }
        else {
            errors.AgeError = ""
        }
        formData.Hobbies.length <= 0 ? errors.HobbiesError = "Please select hobby*" : errors.HobbiesError = ""
        !formData.State ? errors.StateError = "Please Select a State*" : errors.StateError = ""
        !formData.City ? errors.CityError = "Please Select a City*" : errors.CityError = ""
        if (!errors.FirstNameError && !errors.LastNameError && !errors.AgeError && !errors.DOBError && !errors.GenderError && !errors.HobbiesError && !errors.StateError && !errors.CityError) {
            return true
        }
    }
    return { validate }
}