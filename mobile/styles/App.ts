import styled from "styled-components/native";
import { colors } from "./theme";

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: ${colors.cream};
`;

export const PageTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${colors.espresso};
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

export const FormField = styled.TextInput.attrs({
  placeholderTextColor: colors.muted,
})`
  height: 50px;
  color: ${colors.ink};
  border-color: ${colors.walnut};
  border-width: 1px;
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 15px;
  background-color: ${colors.parchment};
`;

export const SubButtonsContainer = styled.View`
  justify-content: space-between;
  flex-direction: row;
  margin: 20px 0px;
`;

export const LinksButtons = styled.Text`
  color: ${colors.mahogany};
  font-size: 15px;
  text-decoration-line: underline;
`;

export const Subtitle = styled.Text`
  color: ${colors.muted};
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
`;
