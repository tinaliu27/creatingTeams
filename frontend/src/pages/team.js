import { useRouter } from 'next/router';

export default function Team() {
  const router = useRouter();
  const { teams } = router.query;
  const teamList = teams ? JSON.parse(teams) : [];

  return (
    <div>
      <h1>Generated Teams</h1>
      {teamList.map((team, index) => (
        <div key={index}>
          <h2>{team.name}</h2>
          <ul>
            {team.members.map((member, i) => (
              <li key={i}>{member}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
