import { Gender } from "@/enum/gender.enum";

export const GenderFormatPtBR = (gender: Gender) => {
  switch (gender) {
    case Gender.GenderMale:
      return "Masculino";
    case Gender.GenderFemale:
      return "Feminino";
    case Gender.GenderNotSay:
      return "Não informado";
    case Gender.GenderOther:
      return "Outro";
  }
};
