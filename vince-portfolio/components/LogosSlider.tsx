import { 
  Code2, 
  Terminal, 
  Database, 
  Cpu, 
  Microchip, 
  Server, 
  CircuitBoard, 
  Layers, 
  GitBranch, 
  Triangle, 
  Zap, 
  Activity, 
  Radio, 
  Monitor 
} from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const skills = [
  { id: "cplusplus", name: "C++", Icon: Code2 },
  { id: "python", name: "Python", Icon: Terminal },
  { id: "supabase", name: "Supabase", Icon: Database },
  { id: "eagle", name: "EAGLE", Icon: Cpu },
  { id: "arduino", name: "Arduino", Icon: Microchip },
  { id: "raspberrypi", name: "Raspberry Pi", Icon: Server },
  { id: "pcb", name: "PCB Assembly", Icon: CircuitBoard },
  { id: "3dprinting", name: "3D Printing", Icon: Layers },
  { id: "git", name: "Git", Icon: GitBranch },
  { id: "github", name: "Github", Icon: GithubIcon },
  { id: "vercel", name: "Vercel", Icon: Triangle },
  { id: "soldering", name: "Soldering", Icon: Zap },
  { id: "ltspice", name: "LTSpice", Icon: Activity },
  { id: "functiongen", name: "Function Generators", Icon: Radio },
  { id: "oscilloscope", name: "Oscilloscopes", Icon: Monitor },
];

export function LogosSlider() {
  return (
    <div className='w-full border-y border-steel/15 py-6'>
      <div className='flex flex-wrap items-center justify-center gap-x-8 gap-y-6'>
        {skills.map((skill) => (
          <div 
            key={skill.id} 
            className='flex items-center gap-3 w-max'
          >
            <skill.Icon className="w-5 h-5 text-silver/80" strokeWidth={1.5} />
            <span className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-sm whitespace-nowrap">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
