import { Container } from "@/shared/ui";
import classes from "./styles.module.scss";

export function Header() {
  return (
    <header className={classes.header}>
      <Container>
        <h1 className={classes.title}>
          тестовое задание
        </h1>
      </Container>
    </header>
  )
}
