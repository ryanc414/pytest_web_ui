/**
 * Contains InfoPane and NavBreadcrumbs components which make up the main
 * centre display pane.
 */

import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

import { LeafNode } from "./Common";
import { css, StyleSheet } from 'aphrodite';

interface InfoPaneProps {
  selectedLeaf: LeafNode | null,
}

/**
 * InfoPane component: renders information on the currently selected testcase
 * (if any)
 * @param props Component props
 */
export const InfoPane = (props: InfoPaneProps) => {
  if (!props.selectedLeaf) {
    return <div>Please select a test.</div>
  }

  console.log(props.selectedLeaf.longrepr);

  return (
    <>
      <div>
        <span className={css(styles.title)}>{props.selectedLeaf.nodeid}</span>
        <span className={css(styles.statusIcon)}>
          {getStatusIcon(props.selectedLeaf.status)}
        </span>
      </div>
      <pre className={css(styles.longrepr)}>{props.selectedLeaf.longrepr}</pre>
    </>
  )
}

/**
 * Return an icon for the given test node status.
 * @param status Node status
 */
const getStatusIcon = (status: string) => {
  switch (status) {
    case "passed":
      return (
        <FontAwesomeIcon icon={faCheckCircle} color="green" size="4x" />
      );

    case "failed":
      return (
        <FontAwesomeIcon icon={faTimesCircle} color="red" size="4x" />
      );

    default:
      return null;
  }
};

interface NavBreadcrumbsProps {
  selection: Array<string>
}

/**
* Navigation breadcrumb menu, used to show the current position in the test
* tree and to navigate back up to any parent branch node.
* @param props Render props
*/
export const NavBreadcrumbs = (props: NavBreadcrumbsProps) => {
  const numSelected = props.selection.length;

  if (!numSelected) {
    return (
      <Breadcrumb>
        <BreadcrumbItem key="home">
          <FontAwesomeIcon icon={faHome} />
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }

  const currSelected = props.selection[numSelected - 1];
  const restSelected = props.selection.slice(0, numSelected - 1);

  return (
    <Breadcrumb>
      <BreadcrumbItem key="home">
        <Link to="/">
          <FontAwesomeIcon icon={faHome} />
        </Link>
      </BreadcrumbItem>
      {
        restSelected.map(
          (nodeid: string, index: number) => (
            <BreadcrumbItem key={nodeid}>
              <Link
                to={
                  "/" +
                  props.selection
                    .slice(0, index + 1)
                    .map(encodeURIComponent)
                    .join("/")
                }
              >
                {nodeid}
              </Link>
            </BreadcrumbItem>
          )
        )
      }
      <BreadcrumbItem>{currSelected}</BreadcrumbItem>
    </Breadcrumb>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: "large",
    "font-weight": "bold",
    //"width": "80%",
    //display: "inline-block",
    "text-overflow": "ellipsis",
    "white-space": "nowrap",
    "padding": "10px",
  },
  statusIcon: {
    "float": "right"
  },
  longrepr: {
    "padding": "10px",
  }
});