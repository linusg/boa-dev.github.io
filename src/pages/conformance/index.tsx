import Layout from "@theme/Layout";
import React from "react";
import { VersionItem } from "./types";
import VersionSelector from "@site/src/components/conformance/VersionSelector";
import ConformanceBanner from "@site/src/components/conformance/Banner";
import ResultsDisplay from "@site/src/components/conformance/ResultsDisplay";

import styles from "./styles.module.css";

// TODO: Add header file to speed up statisic fetching
export default function Conformance() {
  const [version, setVersion] = React.useState<VersionItem | null>(null);
  const [releaseRecords, setReleaseRecords] = React.useState<VersionItem[] | null>(null);

  React.useEffect(()=> {
    // TODO: Create header file that tracks version tag and tag results?
    const fetchMainHeader = async() => {
      const response = await fetch("https://boajs.dev/boa/test262/refs/heads/main/latest.json");
      return await response.json()
    }

    const fetchReleases = async() => {
      const response = await fetch("https://api.github.com/repos/boa-dev/boa/releases");
      const releases = await response.json()
      return releases.map((release) => {
          return {
              tagName: release.tag_name,
              fetchUrl: `https://boajs.dev/boa/test262/refs/tags/${release.tag_name}/latest.json`
          }
      })
  }

  const mainVersion = {
    tagName:"main",
    fetchUrl:`https://boajs.dev/boa/test262/refs/heads/main/latest.json`
  };

  fetchReleases()
      .then(releases => setReleaseRecords([mainVersion, ...releases]))

    fetchMainHeader()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }, [])

  const setNewVersion = (newVersion: VersionItem) => {
    setVersion(newVersion)
  }

  return (
    <Layout title="Conformance" description="Boa Conformance Page">
      <main className={styles.mainLayout}>
        {releaseRecords
        ? <VersionSelector availableVersions={releaseRecords} setNewVersion={setNewVersion} />
        : null}
        {releaseRecords
        ? version
          ? <ResultsDisplay key={version.tagName} activeVersion={version} />
          :<ConformanceBanner focusItems ={releaseRecords.slice(0, 2)} setNewVersion={setNewVersion} />
        : null
        }
      </main>
    </Layout>
  );
}
